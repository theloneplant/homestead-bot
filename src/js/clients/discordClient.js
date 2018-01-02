const path = require('path');
const Discord = require('discord.js');
const config = require(path.join(__dirname, '../../json/config.json'));
const agentHub = require(path.join(__dirname, '../agents/agentHub'));

class DiscordClient {
	constructor(group, credentials) {
		this.group = group;
		this.discordClient = new Discord.Client();
		this.discordClient.login(credentials.token);
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
				this.send(res, msg);
			}
			else if (res.action.stream) {
				var voiceConnection;
				if (this.discordClient.internal && this.discordClient.internal.voiceConnection) {
					voiceConnection = this.discordClient.internal.voiceConnection;
					this.discordClient.internal.voiceConnection.stopPlaying();
					this.discordClient.internal.leaveVoiceChannel();
					voiceConnection.player.dispatcher.end();
					voiceConnection.disconnect();
				}
				if (msg.author.voiceChannel) {
					this.voiceChannel = msg.author.voiceChannel;
				}
				else {
					this.voiceChannel = this.discordClient.channels.get(this.defaultVoiceChannel);
				}

				this.voiceChannel.join().then((connection) => {
					console.log(JSON.stringify(connection));
					this.voiceConnection = connection;
					this.dispatcher = connection.playStream(res.action.stream);

					this.dispatcher.once("end", reason => {
						this.dispatcher = null;
						this.discordClient.user.setGame();
						if(!stopped && !is_queue_empty()) {
							play_next_song();
						}
					});
				}).catch(err => console.log(err));
			}
		}
	}

	send(res, msg) {
		var message = res.action.result.replace('*', '\\*');
		msg.channel.send(msg.author + ' ' + message);
	}
}

module.exports = DiscordClient;
