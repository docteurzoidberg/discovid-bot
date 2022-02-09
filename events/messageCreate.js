module.exports = {
	name: 'messageCreate',
	execute(message) {
    	if (message.author?.bot) 
      		return;
	},
};
