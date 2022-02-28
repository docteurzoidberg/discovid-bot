require('dotenv').config();

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || false;
if(!DISCORD_GUILD_ID) {
    console.error('DISCORD_GUILD_ID environment variable not set');
    process.exit(1);
}

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || false;
if(!DISCORD_CLIENT_ID) {
    console.error('DISCORD_CLIENT_ID environment variable not set');
    process.exit(1);
}

const BOT_TOKEN = process.env.BOT_TOKEN || false;
if(!BOT_TOKEN) {
    console.error('BOT_TOKEN environment variable not set');
    process.exit(1);
}

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();