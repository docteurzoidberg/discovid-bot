const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const MovieDB = require('node-themoviedb');

const wait = require('util').promisify(setTimeout);

const radarr = require('../lib/radarr');
const config = require('../config.json');
const fs = require('fs');

const tmdb = new MovieDB(config.TMDB_API_KEY, {language : 'fr-FR'});

const downloadButtonInterractionCollector = async (result, collector, i) => {
  const onalefilm = result.hasFile;
  const lien = "http://toto.com/jdslkjdlskjdlkjdlkjsldkjdlskjlskjdlkjm/film.mkv";
  if(onalefilm) {
    console.log('On a le film ! :)');
    
    //Mise a jour du message original, avec les nouveaux boutons
    const buttonUrl = new MessageButton()
      .setLabel('LIEN')
      .setStyle('LINK')
      .setURL(lien);

    const rowAvailable = new MessageActionRow()
      .addComponents(
        buttonUrl
      );

    await i.message.edit({ embeds: i.message.embeds , components: [rowAvailable] });

    //Reponse a la demande de lien:
    const response = `Lien de téléchargement: ${lien}`;
    await i.message.reply(response);
  } 
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
    
    const response = `<@${i.member.id}> > Je met le film a télécharger. je te previendrai quand ce sera fini !`;
    await i.channel.send(response);    
    
    //TODO: mettre le film a telecharger
  
    //TODO: attendre la fin du telechargement pour envoyer la notification
    await wait(5000);
    
    //Mise a jour du message original, avec les nouveaux boutons
    const buttonDownloaded = new MessageButton()
      .setCustomId('downloaded')
      .setLabel('Téléchargement terminé')
      .setStyle('SUCCESS')
      .setDisabled(true);

    const buttonUrl = new MessageButton()
      .setLabel('LIEN')
      .setStyle('LINK')
      .setURL(lien);

    const rowDownloaded = new MessageActionRow()
    .addComponents(
      buttonDownloaded, buttonUrl
    );
    await i.message.edit({ embeds: i.message.embeds , components: [rowDownloaded] });

    await i.message.reply(`Télechargement de ${result.title} terminé, lien disponible !`); 
    collector.stop();
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
    const filter = i => i.isButton() && i.customId == 'getlink-' + result.imdbId;
    const collector = interaction.channel.createMessageComponentCollector({filter});
    collector.on('collect', async i => {
      return await downloadButtonInterractionCollector(result, collector, i);
    });
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

    //Response to command
    const button = new MessageButton()
      .setCustomId('getlink-' + result.imdbId)
      .setLabel('Obtenir un lien de telechargement')
      .setStyle('PRIMARY');

    const btnYgg = new MessageButton()
      .setLabel('YGGTORRENT')
      .setStyle('LINK')
      .setURL('http://www.perdu.com');
    
    const row = new MessageActionRow()
      .addComponents(
        button, btnYgg
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
      fs.writeFileSync('./credits.json', JSON.stringify(movieTmdb, null, 2));

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

    await interaction.reply({content: `Film: ${result.title}`, embeds: [movieEmbed], components: [row], ephemeral: false});
	},
};