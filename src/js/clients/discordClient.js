const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const file = require(path.join(__dirname, '../util/file'));
const State = require(path.join(__dirname, '../state/state'));
const filter = require(path.join(__dirname, '../state/filter'));
const agentHub = require(path.join(__dirname, '../agents/agentHub'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

class DiscordClient {

	constructor(group, credentials) {
		this.MAX_MESSAGE_LENGTH = 2000;
		this.MAX_MESSAGES = 10;
		this.group = group;
		this.state = new State();
		this.discordClient = new Discord.Client({
			intents: [ 
				Discord.Intents.FLAGS.GUILDS, 
				Discord.Intents.FLAGS.GUILD_MESSAGES,
				Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Discord.Intents.FLAGS.DIRECT_MESSAGES,
				Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
				Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
				Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			]
		});
		this.discordClient.login(credentials.token);
		this.discordClient.on('ready', msg => {
			console.log("new client ready")
			this.discordClient.user.setActivity(config.groups[this.group].agents.command.prefix + 'help');
		});
		this.discordClient.on('messageCreate', msg => {
			console.log("new client message")
			this.receive(msg);
		});
		this.defaultVoiceChannel = config.groups[this.group].clients.discord.defaultVoiceChannel;
		agentHub.start(group, (res) => {
			
		})
		console.log('Created discord client for ' + group);
	}

	receive(msg) {
		console.log("got message");
		console.log(JSON.stringify(msg));
		if (msg.author.bot) return;
		var botname = this.discordClient.user.toString();
		var from = msg.author.toString();
		console.log("here");
		var firstMember = msg.mentions && msg.mentions.members && msg.mentions.members.first();
		var isMentioned = firstMember ? firstMember.user.id === this.discordClient.user.id : false;
		console.log("here1");
		// var isDM = msg.channel.type === 'dm';
		var to = isMentioned ? botname : null;
		var message = msg.content.replace(/<\S*/g, config.botId);
		console.log("bot name " + botname);
		console.log("first member " + msg.mentions.members.first());
		console.log("target user " + msg.member.user);
		console.log("mentioned " + isMentioned);
		console.log("from " + from);
		console.log("to " + to);
		console.log("message " + message);
		var req = {
			'from': from,
			'to': to,
			'targetUser': msg.member.user,
			'isMentioned': isMentioned,
			// 'isDM': isDM,
			'message': message,
			'client': {
				'group': this.group,
				'state': this.state.getState(),
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
					clearTimeout(this.typeTimeout);
					//msg.channel.startTyping();
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
		if (err) {
			console.log(err);
		}
		else if (res && res.action) {
			if (res.client && res.client.state) {
				this.state.setState(res.client.state);
			}
			if (res.action.statusText) {
				this.updateStatus(res.action.statusText);
			}
			if (res.action.text || res.action.text === '' || res.action.options) {
				var targetUser = msg.member.user;
				console.log("target user: " + targetUser);
				if (targetUser) {
					this.send(res, msg, targetUser);
				}
				else {
					this.send(res, msg);
				}
			}
			else if (res.action.mediaControl) {
				var message = this.mediaControl(res.action.mediaControl);
				if (message) {
					res.action.text = message;
					this.send(res, msg);
				}
				else {
					this.stopTyping(msg);
				}
			}
			else if (res.action.streamService === 'youtube') {
				this.playYoutube(res.action.streamUrl, msg, () => {
					console.log("done playing")
					if (typeof res.action.onEnd === 'function') {
						console.log("onEnd is valid")
						res.action.onEnd();
					}
				});
			}
		}
	}

	send(res, msg, user) {
		if (res && res.action) {
			if (res.action.temp) {
				return this.sendTemp(res, msg);
			}
			var message = this.replaceFormatting(res.action.text);
			var embed = res.action.embed ? JSON.parse(this.replaceFormatting(JSON.stringify(res.action.embed))) : null;
			message = filter.message(message, this.state);
			embed = filter.embed(embed, this.state);
			console.log(embed);
			var embeds = undefined;
			if (embed) {
				const embedObj = new Discord.MessageEmbed();
				if (embed.color) embedObj.setColor(embed.color);
				if (embed.title) embedObj.setTitle(embed.title);
				if (embed.url) embedObj.setURL(embed.url);
				if (embed.description) embedObj.setDescription(embed.description);
				if (embed.thumbnail && embed.thumbnail.url) embedObj.setThumbnail(embed.thumbnail.url);
				if (embed.fields) embedObj.addFields(embed.fields);
				if (embed.image) embedObj.setImage(embed.image);
				embeds = [embedObj];
			}

			if (this.state.isShakespeare()) {
				this.discordClient.user.setActivity(config.groups[this.group].agents.command.prefix + 'helpeth');
			}
			else {
				this.discordClient.user.setActivity(config.groups[this.group].agents.command.prefix + 'help');
			}
			var options = {
				content: message,
				embeds: embeds
			}
			console.log(options);

			var clientConfig = config.groups[this.group].clients.discord;
			var guild = this.discordClient.guilds[clientConfig.guildID];
			console.log("userrr: " + user || (msg && msg.member && msg.member.user));
			var targetUser = user || (msg && msg.member && msg.member.user);
			var targetChannel = (msg && msg.channel) || (guild && guild.channels[clientConfig.defaultTextChannel]);
			console.log("target user: " + targetUser + ", target channellll: " + targetChannel);

			if (res.action.private && msg.author) {
				msg.author.send(options).then((msg) => {
					this.onSend(res, msg);
				}).catch(console.log);
				if (targetChannel && targetChannel.type === 'GUILD_TEXT') {
					this.sendReply(msg, 'I\'ve sent you a PM');
				} else {
					console.error('Unable to send text message to channel of type ' + targetChannel.type);
				}
			} else if (targetChannel) {
				if (targetChannel.type === 'GUILD_TEXT' || targetChannel.type === 'DM') {
					var userText = targetUser ? '<@' + targetUser + '> ' : '';
					this.sendMessage(targetChannel, userText, message, embeds, (msg) => {
						this.stopTyping(msg);
						this.onSend(res, msg);
					});
				} else {
					console.error('Unable to send text message to channel of type ' + targetChannel.type);
				}
			} else {
				console.error("Unable to send message\nTarget channel: " + targetChannel + "\nTarget user: " + targetUser);
			}
		}
		else {
			console.error('Unable to send response, action result is undefined');
		}
	}

	sendMessage(targetChannel, userText, message, embeds, cb, maxMessages = this.MAX_MESSAGES) {
		var messageRemaining = message;
		var messageChunk = "";
		var paragraphArr = messageRemaining.split('\n');
		for (var i = 0; i < paragraphArr.length; i++) {
			// If the chunk contains one or more paragraphs then update the remaining message and send the chunk
			if (userText.length + messageChunk.length + paragraphArr[i].length <= this.MAX_MESSAGE_LENGTH) {
				messageRemaining = paragraphArr.slice(i + 1).join('\n');
				messageChunk += paragraphArr[i] + '\n';
			}
			else if (i > 0) {
				console.log("posting paragraphs");
				messageRemaining = paragraphArr.slice(i).join('\n');
				break;
			}
			// Split by sentence if a single paragraph is too long
			else {
				console.log("posting sentences");
				var sentenceArr = message.split(/(?<=[.?!])\s/gm);
				for (var j = 0; j < sentenceArr.length; j++) {
					if (userText.length + messageChunk.length + sentenceArr[i].length <= this.MAX_MESSAGE_LENGTH) {
						messageRemaining = sentenceArr.slice(i + 1).join('\n');
						messageChunk += sentenceArr[i] + ' ';
					}
					else if (j > 0) {
						console.log("posting sentence");
						messageRemaining = sentenceArr.slice(i).join(' ');
						break;
					}
					else {
						console.log("posting remainder");
						messageChunk = message.substr(0, this.MAX_MESSAGE_LENGTH);
						messageRemaining = sentenceArr.substr(this.MAX_MESSAGE_LENGTH, message.length);
						break;
					}
				}
				break;
			}
		}

		var options = {
			content: userText + messageChunk,
			embeds: embeds
		}
		targetChannel.send(options).then((msg) => {
			console.log("sent (" + maxMessages + "): " + messageRemaining)
			if (maxMessages - 1 <= 0 || messageRemaining.length === 0) {
				cb(msg);
				return;
			}
			this.sendMessage(targetChannel, userText, messageRemaining, options, cb, maxMessages - 1);
		}).catch(console.log);
	}

	stopTyping(msg, retry = 5) {
		// msg.channel.stopTyping();
		// this.typeTimeout = setTimeout(() => {
		// 	this.stopTyping(msg, --retry);
		// }, 200);
	}

	sendTemp(msg, res, options, timeout = 10000) {
		var text = res && res.action && res.action.text ? res.action.text : res;
		text = filter.message(text, this.state);
		console.log('options');
		console.log(options);
		msg.channel.send(text, options).then(message => {
			setTimeout(() => {
				message.delete();
			}, timeout);
		}).catch(console.log);
	}

	sendReply(msg, res, options) {
		var text = res && res.action && res.action.text ? res.action.text : res;
		text = filter.message(text, this.state);
		console.log('options');
		console.log(options);
		msg.reply(text, options).then(message => {
			// setTimeout(() => {
			// 	message.delete();
			// }, timeout);
		}).catch(console.log);
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
		if (res && res.action && res.action.emotes && res.action.emotes.length > 0) {
			msg.react(res.action.emotes[0]).then(() => {
				res.action.emotes = res.action.emotes.slice(1);
				this.onSend(res, msg);
			}).catch((err) => {
				console.log(err);
				if (res.action.cb) res.action.cb(err);
			});
		}
		else {
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

	mediaControl(controlFunction) {
		if (this.dispatcher && typeof this.dispatcher.destroyed === 'boolean' && !this.dispatcher.destroyed) {
			if (controlFunction === 'play' || controlFunction === 'resume') {
				this.dispatcher.resume();
				this.sendHeartbeat();
				return undefined;
			}
			else if (controlFunction === 'pause') {
				this.dispatcher.pause();
				clearTimeout(this.heartbeatTimeout);
				return undefined;
			}
			else if (controlFunction === 'stop') {
				this.dispatcher.end('User requested stream to end');
				clearTimeout(this.heartbeatTimeout);
				return undefined;
			}
			return 'Sorry I don\'t support ' + controlFunction + ' yet';
		}
		return 'Unable to ' + controlFunction + ', there is no active music stream';
	}

	sendHeartbeat() {
		this.heartbeatTimeout = setTimeout(() => {
			if (!this.dispatcher || this.dispatcher.destroyed) {
				return;
			}
			if (!this.dispatcher.paused) {
				this.dispatcher.resume();
				// this.sendHeartbeat();
			}
		}, 30000);
	}

	playYoutube(streamUrl, msg, cb) {
		console.log("Playing youtube")
		var voiceChannel;
		if (this.dispatcher) {
			this.dispatcher.end('Playing new track');
		}
		if (msg && msg.author && msg.member.voice && msg.member.voice.channel) {
			voiceChannel = msg.member.voice.channel;
			console.log("using vc1: " + voiceChannel + ", " + this.defaultVoiceChannel);
		}
		else {
			voiceChannel = this.discordClient.channels.cache.get(this.defaultVoiceChannel);
			console.log("using vc2: " + voiceChannel + ", " + this.defaultVoiceChannel);
		}
		voiceChannel.join().then((connection) => {
			console.log("Joined voice channel")
			this.connection = connection;
			var stream = ytdl(streamUrl, {
				filter: 'audioonly'
			});
			this.dispatcher = this.connection.playStream(stream, {
				seek: 0,
				volume: 1
			});
			// this.sendHeartbeat();
			// this.dispatcher.setBitrate('auto');
			this.dispatcher.on('error', (error) => {
				console.log('Dispatcher error: \n' + error);
			});
			this.dispatcher.on('end', (reason) => {
				console.log('Reason: ' + reason);
				// This is a temporary hack for playing a song after one is already started
				this.connection.disconnect();

				if (typeof cb === "function") {
					console.log("Done playing, sending response");
					cb();
				};
			});
			this.connection.on('error', (error) => {
				console.log('Connection error: \n' + error);
			});
		}).catch(console.log);
	}
}

module.exports = DiscordClient;
