const path = require('path');
const YouTube = require('youtube-node');
const credentials = require(path.join(__dirname, '../../../credentials/credentials.json'));

class YouTube {
	constructor(group, credentials) {
		this.group = group;
		this.discordClient = new Discord.Client();
		this.discordClient.login(credentials.token);
		this.discordClient.on('message', msg => {
			this.receive(msg);
		});
	}
}

module.exports = YouTube;
