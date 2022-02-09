module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		//client.user.setStatus('invisible', 'Made by DrZoid') 
		client.user.setStatus('invisible');
	},
};