require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, ReactionUserManager } = require('discord.js');
const MovieDB = require('node-themoviedb');

const watcher = require('../lib/watch');
const radarr = require('../lib/radarr');
const api = require('../lib/api');

const crypto = require("crypto");

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const EXTERNAL_URL = process.env.EXTERNAL_URL || 'localhost:3000';
const PERMIT_DL = process.env.PERMIT_DL === 'true';

const tmdb = new MovieDB(TMDB_API_KEY, {language : 'fr-FR'});

const downloadButtonInterractionCollector = async (result, collector, i) => { 

  //File already present. no need to download. generate link and send back to channel.
  if(result.hasFile) {
    console.log('On a le film ! :)');
    //console.log(result);
    const newlink = await api.addLink({
      file: result.movieFile.path,
      name: result.movieFile.relativePath,
      size: result.movieFile.size,
      type: result.type||'?',
    });
    if(!newlink) {
      console.log('Error while adding link');
      return;
    }
    const linkurl = encodeURI(newlink.url||EXTERNAL_URL+newlink.id+'/'+newlink.name);
    console.log(linkurl);
    //Mise a jour du message original, avec les nouveaux boutons
    const buttonUrl = new MessageButton()
      .setLabel('LIEN')
      .setStyle('LINK')
      .setURL(linkurl);

    const rowAvailable = new MessageActionRow()
      .addComponents(
        buttonUrl
      );

    await i.message.edit({ embeds: i.message.embeds , components: [rowAvailable] });

    //Reponse a la demande de lien:
    const response = `Lien de téléchargement: ${linkurl}`;
    await i.message.reply(response);
    collector.stop();
  } 
  //File not already present. launch the download and warn the user about it. update message link when download is complete with the link
  else {
    console.log('On a pas le film ! :(');

    //Mise a jour du message original, avec les nouveaux boutons
    const buttonDownloading = new MessageButton()
      .setCustomId('waitdownloadlink')
      .setLabel('Téléchargement en cours...')
      .setStyle('SECONDARY')
      .setDisabled(true);

    const rowDownloading = new MessageActionRow()
    .addComponents(
      buttonDownloading
    );
    await i.message.edit({ embeds: i.message.embeds , components: [rowDownloading] });
    
    //Previens l'utilisateur de la mise en telechargement
    const response = `<@${i.member.id}> > Je mets le film a télécharger. je te préviendrais quand ce sera fini !`;
    await i.channel.send(response);    
    
    //Mettre le film a telecharger

    var movieid = 0;
    if(result.id && result.id>0) {
      console.error('Already added: ' + result.id);
      movieid = result.id;
    } 
    else {
        const addedMovie = await radarr.addMovie(result); 
        console.log(addedMovie);
        if(!addedMovie) {
            console.log('No movie added');
            return;
        }
        movieid = addedMovie.id;
    }

    result.id = movieid;

    //attendre le telechargement
    const watch = watcher(movieid, result);

    watch.on('started', function(movieId) {
      console.log(`watcher started for ${movieId}`);
    });
    watch.on('stoped', function(movieId) {
      console.log(`watcher stopped for ${movieId}`);
    });
    watch.on('downloaded', async function(movieId, ctx) {
      watch.stop();
      console.log(`${movieId} downloaded`);
      if(movieid==movieId) {
        console.log('BOT> Movie is Downloaded !');
      }

      //Creation du lien de partage
      const newlink = await api.addLink({
        file: ctx.movieFile.path,
        name: ctx.movieFile.relativePath,
        size: ctx.movieFile.size,
        type: ctx.type||'?',
      });
      console.log(newlink);
      if(!newlink) {
        console.log('Error while adding link');
        return;
      }

      //Encoding pour discord
      const linkurl = encodeURI(newlink.url||EXTERNAL_URL+newlink.id+'/'+newlink.name);
      console.log(linkurl);
      
      //Mise a jour du message original, avec les nouveaux boutons
      const buttonDownloaded = new MessageButton()
        .setCustomId('downloaded')
        .setLabel('Téléchargement terminé')
        .setStyle('SUCCESS')
        .setDisabled(true);

      const buttonUrl = new MessageButton()
        .setLabel('LIEN')
        .setStyle('LINK')
        .setURL(linkurl);

      const rowDownloaded = new MessageActionRow()
      .addComponents(
        buttonDownloaded, buttonUrl
      );
      await i.message.edit({ embeds: i.message.embeds , components: [rowDownloaded] });
      await i.message.reply(`Télechargement de ${result.title} terminé, lien disponible !`); 
      collector.stop();
    });

    watch.start();
  }
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('film')
		.setDescription('Cherche un film!')
    .addStringOption(option => option.setName('film').setDescription('Nom du film a chercher')),
	
  async execute(client, interaction) {
    
    //radarr lookup
    const terms = interaction.options.getString('film');
    const movies = await radarr.lookupMovie(terms);
    if (!movies || movies.length == 0) {
      console.log(`Aucun film trouvé pour ${terms}`);
      return interaction.reply({content: `Aucun film trouvé pour ${terms}`, ephemeral: true});;
    }

    const result = movies[0];
    //console.log(result);

    //Button handling
 
    const randomid = crypto.randomBytes(20).toString('hex');
    const filter = i => i.isButton() && (i.customId == 'getlink-' + result.imdbId + '-' + randomid);
    const collector = interaction.channel.createMessageComponentCollector({filter});
    collector.on('collect', async i => {
      return await downloadButtonInterractionCollector(result, collector, i);
    });
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

    //Response to command
    const button = new MessageButton()
      .setCustomId('getlink-' + result.imdbId + '-' + randomid)
      .setLabel('Obtenir un lien de telechargement')
      .setStyle('PRIMARY');
    
    const row = new MessageActionRow()
      .addComponents(
        button
      );
    
    var fields = [];
     
    if(result.genres && result.genres.length > 0) {
      fields.push({ name: 'Genre', value: result.genres.join(', '), inline: true});
    }
    if(result.year && result.year.toString() !=='') {
      fields.push({ name: 'Année', value: result.year.toString(), inline: true});
    }
    if(result.studio && result.studio !=='') {
      fields.push({ name: 'Studio', value: result.studio, inline: true});
    }

    //tmdb more info
    try {
      const args = {
        pathParameters: {
          movie_id: result.tmdbId,
        },
      };
      const movieTmdb = await tmdb.movie.getCredits(args);
      //console.log(movieTmdb);

      const director = movieTmdb.data.crew.find((crew) => {
        return crew.job === 'Director';
      });
      console.log(director.name);

      const actors = movieTmdb.data.cast.map((cast) => {
        return cast.name;
      });

      //limit to 3 actors
      const actorsLimited = actors.slice(0, 3);
      console.log(actorsLimited.join(", "));
      
      if(director?.name !== '') {
        fields.push({ name: 'Réalisateur', value: director.name, inline: true});
      }
      if(actorsLimited.length>0) {
        fields.push({ name: 'Acteurs', value: actorsLimited.join(', '), inline: true});
      }
    } catch (error) {
      console.error(error);
    }
  
    const movieEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(result.title)
      .setURL(`http://imdb.com/title/${result.imdbId}`)
      .setDescription(result.overview)
      .setThumbnail(result.remotePoster)
      .addFields(fields);

    const msg = await interaction.reply({content: `Film: ${result.title}`, embeds: [movieEmbed], components: PERMIT_DL ? [row]:[], ephemeral: false, fetchReply: true});
    
    const reactions = await api.getReactions({movieId: result.imdbId.replace('tt', '')});
    console.log(reactions);
    if(reactions && reactions.length>0) {
      const reactionsContent = [];
      reactions.forEach((reaction) => {
        reactionsContent.push(`${reaction.user.username}> ${reaction.reaction}`);
      });   
      msg.channel.send({content: reactionsContent.join('\n'), ephemeral: false, fetchReply: false});
    }
	},
};