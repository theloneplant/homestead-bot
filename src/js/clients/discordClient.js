const path = require('path');
const ytstream = require('youtube-audio-stream');
const Discord = require('discord.js');
const file = require(path.join(__dirname, '../util/file'));
const agentHub = require(path.join(__dirname, '../agents/agentHub'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));
const bing = require(path.join(__dirname, '../util/bing'));

class DiscordClient {
	constructor(group, credentials) {
		this.group = group;
		this.discordClient = new Discord.Client();
		this.discordClient.login(credentials.token);
		this.discordClient.on('ready', msg => {
			this.discordClient.user.setGame(config.groups[this.group].agents.command.prefix + 'help');
		});
		this.discordClient.on('message', msg => {
			this.receive(msg);
		});
		this.defaultVoiceChannel = config.groups[this.group].clients.discord.defaultVoiceChannel;
		console.log('Created discord client for ' + group);
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
				'group': this.group,
				'type': 'discord'
			}
		};

		agentHub.interpret(req, (res, err) => {
			this.handleResponse(msg, res, err);
		});
	}

	handleResponse(msg, res, err) {
		if (err) {
			console.log(err);
		}
		else if (res && res.action) {
			if (res.action.result) {
				if (res.action.ttl) {
					this.sendTemp(msg, res, ttl);
				}
				else {
					this.send(msg, res);
				}
			}
			else if (res.action.streamService === 'youtube') {
				this.playYoutube(res.action.streamUrl, msg);
			}
		}
	}

	send(msg, res) {
		var message = res.action.result.replace('*', '\\*')
						.replace(/<i>|<\/i>/g, '*')
						.replace(/<u>|<\/u>/g, '__')
						.replace(/<b>|<strong>|<\/b>|<\/strong>/g, '**');
		if (res.action.private) {
			msg.author.send(msg.author + ' ' + message);
			if (msg.channel.type === 'text') {
				this.sendTemp(msg, 'I\'ve sent you a PM');
			}
		}
		else {
			msg.channel.send(msg.author + ' ' + message);
		}
	}

	sendTemp(msg, res, timeout = 10000) {
		var text = res && res.action && res.action.result ? res.action.result : res;
		msg.channel.send(text).then(message => {
			message.delete(timeout);
		});
	}

	playYoutube(streamUrl, msg) {
		var voiceChannel;
		if (this.dispatcher) {
			this.dispatcher.end('Playing new track');
		}
		if (msg && msg.member && msg.member.voiceChannel) {
			voiceChannel = msg.member.voiceChannel;
		}
		else {
			voiceChannel = this.discordClient.channels.get(this.defaultVoiceChannel);
		}
		voiceChannel.join().then((connection) => {
			var stream = ytstream(streamUrl, { filter : 'audioonly' });
			this.connection = connection;
			this.dispatcher = this.connection.playStream(stream, { seek: 0, volume: 0.75 });
			this.dispatcher.setBitrate(128);

			this.connection.on('error', (error) => {
				console.log('Connection error: \n' + error);
			});
			this.dispatcher.on('error', (error) => {
				console.log('Dispatcher error: \n' + error);
			});
			this.dispatcher.on('end', (reason) => {
				console.log('Reason: ' + reason);
				// This is a temporary hack for playing a song after one is already started
				this.connection.disconnect();
				// TODO: Send response to action and queue next song if available
			});
		}).catch(err => console.log('Error: ' + err));
	}
}

module.exports = DiscordClient;
