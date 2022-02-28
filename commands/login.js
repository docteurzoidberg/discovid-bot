const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const api = require('../lib/api');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Cree le cookie d\'auth sur le navigateur pour les services discovid!'),
	
  async execute(client, interaction) {
    
    //Creation du lien d'auth
    const newlink = await api.createAuthLink({
      user: interaction.user,
    });
    
    console.log(newlink);

    if(!newlink) {
      console.log('Error while creating auth link');
      return;
    }

    //Encoding pour discord
    const linkurl = encodeURI(newlink.url+'login/'+newlink.token);
    console.log(linkurl);
    
    const buttonUrl = new MessageButton()
      .setLabel('LOGIN')
      .setStyle('LINK')
      .setURL(linkurl);

    const row = new MessageActionRow()
    .addComponents(
      buttonUrl
    );

    await interaction.reply({content: `Autentification discovid !\nCliquez sur le bouton login pour créer le cookie navigateur`, components: [row], ephemeral: true});
	},
};