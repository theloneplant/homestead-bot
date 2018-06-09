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
				'channel': {
					'type': msg.channel.type
				},
				'type': 'discord'
			}
		};

		try {
			agentHub.interpret(req, (err, res, cb) => {
				console.log(res);
				if (res.startTyping) {
					msg.channel.startTyping();
				}
				else {
					this.handleResponse(err, msg, res, cb);
				}
			});
		}
		catch (err) {
			console.log(err);
			this.send(msg, 'My brain just malfunctioned please call an ambulance');
		}
	}

	handleResponse(err, msg, res, cb) {
		console.log('there');
		if (err) {
			console.log(err);
		}
		else if (res && res.action) {
			console.log('here');
			if (res.action.statusText) {
				this.updateStatus(res.action.statusText);
			}
			if (res.action.text || res.action.text === '' || res.action.options) {
				if (res.action.temp) {
					console.log('temp');
					this.sendTemp(msg, res);
				}
				else {
					console.log('send');
					this.send(msg, res);
				}
			}
			else if (res.action.streamService === 'youtube') {
				this.playYoutube(res.action.streamUrl, msg);
			}
		}
	}

	send(msg, res) {
		var message = this.replaceFormatting(res.action.text);
		var embed = res.action.embed ? JSON.parse(this.replaceFormatting(JSON.stringify(res.action.embed))) : null;
		console.log(embed);
		var options = { embed };
		console.log(options);
		if (res.action.private) {
			msg.author.send(message, options).then((msg) => {
				this.onSend(res, msg);
			}).catch(console.log);
			if (msg.channel.type === 'text') {
				this.sendTemp(msg, 'I\'ve sent you a PM');
			}
		}
		else {
			msg.channel.send(msg.author + ' ' + message, options).then((msg) => {
				msg.channel.stopTyping();
				this.onSend(res, msg);
			}).catch(console.log);
		}
	}

	sendTemp(msg, res, options, timeout = 10000) {
		var text = res && res.action && res.action.text ? res.action.text : res;
		console.log('options');
		console.log(options);
		msg.channel.send(text, options).then(message => {
			msg.channel.stopTyping();
			message.delete(timeout);
		});
	}

	updateStatus(statusText, retry = 5) {
		console.log('updating status')
		if (retry <= 0) return;
		if (statusText) {
			this.discordClient.user.setPresence({
				game: { name: statusText },
				status: 'online'
			}).catch((err) => {
				console.log(err);
				this.updateStatus(statusText, --retry);
			});
		}
	}

	onSend(res, msg) {
		console.log('hello world')
		if (res && res.action && res.action.emotes && res.action.emotes.length > 0) {
			console.log('res.action.emotes')
			console.log(typeof res.action.emotes[0])
			msg.react(res.action.emotes[0]).then(() => {
				res.action.emotes = res.action.emotes.slice(1);
				this.onSend(res, msg);
			}).catch((err) => {
				console.log(err);
				if (res.action.cb) res.action.cb(err);
			});
		}
		else {
			console.log('success')
			if (res.action.cb) res.action.cb();
		}
	}

	replaceFormatting(text) {
		return text.replace('*', '\\*')
			.replace(/<i.*?>|<\/i>/g, '*')
			.replace(/<u.*?>|<\/u>/g, '__')
			.replace(/<b.*?>|<strong>|<\/b>|<\/strong>/g, '**')
			.replace(/<script.*?>|<\/script>/g, '```');
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
