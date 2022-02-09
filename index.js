const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const config = require("./config.json");
const db = require('./db');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	presence: {
		status: 'invisible'
	}
});

client.commands = new Collection();
client.buttons = new Collection();

const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.buttons.set(button.data.name, button);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

//handle process signals
async function closeGracefully(signal) {
  console.log(`Received signal to terminate: ${signal}, closing`);
  await db.close();
  process.exit();
}
process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

//wait db connect
db.connect();
console.log('Db Connected');

//start discord's bot
client.login(config.BOT_TOKEN);