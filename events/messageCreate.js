const api = require('../lib/api');
module.exports = {
	name: 'messageCreate',
	async execute(client, message)  {
        
        //ignore bot messages
        if(message.author.bot) 
            return;

        //message is not a reply
        if(!message.reference) 
            return;

        //fetch reference (replied) message
        const referenceMessage = await message.channel.messages.fetch(message.reference.messageId); 
        
        if(!referenceMessage.author.bot) 
            return;     

        if(!referenceMessage.embeds || referenceMessage.embeds.length < 1) {
            console.log('no embed in reference message');
            return;
        }
        
        const embed = referenceMessage.embeds[0];
        const match = embed.url.match(/title\/tt(.*)/)
        if(!match && match.length < 2) {
            console.error(`No match for ${embed.url}`);
            return;
        }
        const imdbId = match[1];
        console.log(`message reference movie id : ${imdbId}`);
        //const reactions = await api.getReactions({movieId: imdbId});
        const newReactions = [];
        newReactions.push({user: message.author, reaction: message.content});
        await api.addReactions({movieId: imdbId, reactions: newReactions});
        message.reply(`Merci pour l'avis, c'est noté !`);
    }
};