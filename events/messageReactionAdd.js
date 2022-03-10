const api = require('../lib/api');

module.exports = {
	name: 'messageReactionAdd',
	async execute(client, reaction, user) {

		// When a reaction is received, check if the structure is partial
		if (reaction.partial) {
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
			} catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}
		// Now the message has been cached and is fully available
		
		if(!reaction.message.author.bot) 
			return;
		if(!reaction.message.embeds || reaction.message.embeds.length<1)
			return;

		console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
		// The reaction is now also fully available and the properties will be reflected accurately:
		console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
		
		//imdbid?
		const match = reaction.message.embeds[0].url.match(/title\/tt(.*)/);
		if(!match || match.lenght<2) {
			console.log('No imdbid found');
			return;
		}
		
		const imdbid = match[1];
		console.log(imdbid);
		try {
			const newReactions = [];
			const users = await reaction.users.fetch();
			console.log(users);
 			users.map(u => {
				newReactions.push({user: u, emoji: reaction.emoji.name});
			});
			console.log(newReactions);
			const data = await api.addReactions({
				movieId: imdbid,
				reactions: newReactions
			});
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	},
};
