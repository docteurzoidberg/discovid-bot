module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction)  {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		if(interaction.isButton()) { 
			console.log(interaction.customId);

			await interaction.deferUpdate({ephemeral: false}).catch(()=>{});

			const button = client.buttons.get(interaction.customId);
			if(!button) return;
			try {
				await button.execute(client, interaction);
			} catch (error) {
				console.error(error);
				//await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
			}
			return;
		}
		else if (interaction.isCommand()) {
			
			console.log(interaction.commandName);
			
			//await interaction.deferReply({ephemeral: false}).catch(()=>{});

			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(client, interaction);
			} catch (error) {
				console.error(error);
				//await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		return;
	},
};
