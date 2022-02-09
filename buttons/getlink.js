
const { MessageActionRow, MessageButton } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const radarr = require('../lib/radarr');

module.exports = {
    data: {
        name: 'getlink',
        customId: 'getlink',
    },
    async execute(client, interaction) {

        const originalinteraction = interaction;
        //console.log(interaction);

        
        //interaction.component.setStyle("DANGER");
        //interaction.update({components: new MessageActionRow().addComponents(interaction.component)});
        //
        //await wait(5000);
        
        const button = new MessageButton()
          .setCustomId('waitdownloadlink')
          .setLabel('Téléchargement en cours...')
          .setStyle('SECONDARY')
          .setDisabled(true);
      
        const row = new MessageActionRow()
          .addComponents(
            button
          );
        
        //TODO: faire un lookup voir si on a le film dans la base de données
        //console.log(interaction.message);
        //console.log(interaction.message.embeds[0].fields);
        const moviename = interaction.message.embeds[0].title.substring(6);
        console.log(moviename);
        
        const movies = await radarr.lookupMovie(moviename);
        
        console.log(movie);

        const onalefilm = movie.hasFile;
        const lien = "http://toto.com/jdslkjdlskjdlkjdlkjsldkjdlskjlskjdlkjm/film.mkv";

        const response = onalefilm? `Lien de téléchargement: ${lien}`: `<@${interaction.member.id}> > Je met le film a télécharger. je te previendrai quand ce sera fini !`;
        
        await interaction.editReply({ embeds: originalinteraction.message.embeds , components: [row] });
        
        await originalinteraction.channel.send(response, {components: [row]});

        
        //TODO: mettre le film a telecharger
        //TODO: attendre la fin du telechargement pour envoyer la notification
        await wait(5000);
        await originalinteraction.message.reply(`Télechargement de ${movie.title} terminé, lien: ${lien}`); 
        
        /*
        client.onDownloadCompleted(movie.id, async () => {
            //TODO: mettre le film a telecharger
            //TODO: attendre la fin du telechargement pour envoyer la notification
            await originalinteraction.channel.send(`<@${interaction.member.id}> > Téléchargement terminé !`);
            await originalinteraction.delete();
        }) 
        */
    }
};