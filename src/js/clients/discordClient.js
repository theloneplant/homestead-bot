const path = require('path');
const Discord = require('discord.js');
const config = require(path.join(__dirname, '../../json/config.json'));
const clientHub = require(path.join(__dirname, '../clients/clientHub'));

class DiscordClient {
	constructor(name, credentials) {
		this.name = name;
		this.discordClient = new Discord.Client();
		this.discordClient.login(credentials.token);
		this.discordClient.on('message', msg => {
			this.receive(msg);
		});
	}

	receive(msg) {
		if (msg.author.bot) return;
		var botname = this.discordClient.user.username + '#' + this.discordClient.user.discriminator;
		var from = msg.author.username + '#' + msg.author.discriminator;
		var to = msg.isMentioned(this.discordClient.user) ? botname : null;
		var message = msg.content.replace(/<\S*/g, config.botId);
		var req = {
			'from': from,
			'to': to,
			'message': message,
			'client': {
				'name': this.name,
				'type': 'discord'
			}
		};

		clientHub.process(req, (res, err) => {
			if (err) {
				console.log(err);
			}
			else if (res) {
				this.send(res, msg);
			}
		});
	}

	send(res, msg) {
		var message = res.action.result.replace('*', '\\*');
		msg.channel.send(msg.author + ' ' + message);
	}
}

module.exports = DiscordClient;
