const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logout')
		.setDescription('Detruit le cookie d\'auth sur le navigateur pour les services discovid!'),
	
  async execute(client, interaction) {
    
    //Encoding pour discord
    const linkurl = encodeURI(config.EXTERNAL_AUTH_URL+'logout');
    console.log(linkurl);
    
    const buttonUrl = new MessageButton()
      .setLabel('LOGOUT')
      .setStyle('LINK')
      .setURL(linkurl);

    const row = new MessageActionRow()
    .addComponents(
      buttonUrl
    );

    await interaction.reply({content: `Autentification discovid !\nCliquez sur le bouton logout pour détruire le cookie navigateur`, components: [row], ephemeral: true});
	},
};