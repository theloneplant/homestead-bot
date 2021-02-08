const path = require('path');
const file = require(path.join(__dirname, 'util/file'));
const math = require(path.join(__dirname, 'util/math'));
const config = file.read(path.join(__dirname, '../../config/server.json'));

module.exports = function() {
	var id = config.botId;

	/**
	 * Types of params supported by the bot, each are parsed in different ways
	 */
	var type = {
		'default': 0, // single word, or takes remaining line if final param
		'phrase': 1, // formatted as "multiple words can go here"
		'array': 2 // formatted as "phrase1" "phrase2" "phrase3"... or default default default...
	}

	/**
	 * List of all features supported by the bot, used to build help messages and commands
	 */
	var features = {
		'help': {
			'name': 'Help',
			'description': 'To get help with a specific feature, specify one of the following in the help command:',
			'action': 'Help',
			'commands': [
				{
					'command': 'help',
					'params': [{'name': 'feature', 'type': type.default}]
				},
				{
					'command': 'helpeth',
					'params': [{'name': 'feature', 'type': type.default}],
					'ignore': true
				}
			]
		},
		'roll': {
			'name': 'Dice Rolling',
			'description': 'Roll one or more dice with optional modifiers',
			'action': 'DiceRoll',
			'commands': [
				{
					'command': 'roll',
					'params': [{'name': 'roll', 'type': type.default}]
				}
			],
			'phrases': [
				id + ' roll',
				'Hey ' + id + ' roll 3d6 + d4 - 1',
			]
		},
		'coinflip': {
			'name': 'Coin Flip',
			'description': 'Flips a coin, it\'s pretty straightforward. Heads or tails?',
			'action': 'CoinFlip',
			'commands': [{ 'command': 'flip' }, { 'command': 'coinflip' }],
			'phrases': [
				id + ' flip a coin',
				'Hey ' + id + ' do a coin flip',
			]
		},
		'youtube': {
			'name': 'YouTube Search',
			'description': 'Searches YouTube for a video and posts the top result in chat',
			'action': 'YouTube',
			'commands': [
				{
					'command': 'youtube',
					'params': [{'name': 'search', 'type': type.default}]
				},
				{
					'command': 'video',
					'params': [{'name': 'search', 'type': type.default}]
				}
			],
			'phrases': [
				id + ' search YouTube for [search]',
				'Hey ' + id + ' look up [search] on YouTube'
			]
		},
		'play': {
			'name': 'Music Playing',
			'description': 'Search for music/video and play it in a voice channel.',
			'action': 'PlayMusic',
			'commands': [
				{
					'command': 'play',
					'params': [{'name': 'search', 'type': type.default}],
					'constants': [{'name': 'mediaControl', 'value': 'resume'}]
				}
			],
			'phrases': [
				id + ' play Flight of the Valkyrie',
				'Hey ' + id + ' play Imperial March on YouTube'
			]
		},
		'pause': {
			'name': 'Pause Music Playback',
			'description': 'Pause an ongoing music stream.',
			'action': 'PlayMusic',
			'commands': [{
				'command': 'pause',
				'constants': [{'name': 'mediaControl', 'value': 'pause'}]
			}],
			'phrases': [
				id + ' pause',
				'Hey ' + id + ' pause'
			]
		},
		'stop': {
			'name': 'Stop Music Playback',
			'description': 'Stop an ongoing music stream, this will cause the bot to leave the voice channel.',
			'action': 'PlayMusic',
			'commands': [{
				'command': 'stop',
				'constants': [{'name': 'mediaControl', 'value': 'stop'}]
			}],
			'phrases': [
				id + ' stop',
				'Hey ' + id + ' stop'
			]
		},
		'goodjob': {
			'name': 'Good Job!',
			'description': 'You\'re doing good, keep it up!',
			'action': 'PlayMusic',
			'commands': [{
				'command': 'goodjob',
				'constants': [
					{'name': 'search', 'value': 'https://www.youtube.com/watch?v=-ynhl8wt3pc'},
					{'name': 'message', 'value': 'Good Job!'}
				]
			}]
		},
		'oof': {
			'name': 'Oof',
			'description': 'Oof',
			'action': 'PlayMusic',
			'commands': [{
				'command': 'oof',
				'constants': [{
						'name': 'search',
						'value': 'https://www.youtube.com/watch?v=iTHKqgKO45M'
					},
					{
						'name': 'message',
						'value': 'OOF'
					}
				]
			}]
		},
		'translate': {
			'name': 'Translate',
			'description': 'Translates text into the desired language (English is default)',
			'action': 'Translate',
			'phrases': [
				id + ' translate hello to German',
				'Hey ' + id + ' translate お前はもう死んでいる'
			]
		},
		'bobross': {
			'name': 'Bob Ross Episodes',
			'description': 'Posts a random episode from The Joy of Painting',
			'action': 'BobRoss',
			'commands': [{
				'command': 'bob',
				'command': 'bobross',
			}]
		},
		'copypasta': {
			'name': 'Copypasta Posting',
			'description': 'Posts a random copypasta',
			'action': 'PostReddit',
			'commands': [
				{
					'command': 'copypasta',
					'constants': [
						{'name': 'subreddit', 'value': 'copypasta'},
						{'name': 'time', 'value': 'week'}
					]
				}
			]
		},
		'meme': {
			'name': 'Meme Posting',
			'description': 'Posts a dank meme',
			'action': 'PostMeme',
			'commands': [{ 'command': 'meme' }],
			'phrases': [
				id + ' post a meme',
				'Hey ' + id + ' gimme a meme'
			]
		},
		'release': {
			'name': 'Release Dates',
			'description': 'Searches the web for release date. If nothing is found it\'ll look for a relevant link.',
			'action': 'ReleaseDate',
			'commands': [
				{
					'command': 'release',
					'params': [{'name': 'search', 'type': type.default}]
				}
			],
			'phrases': [
				id + ' when did the Nintendo 64 come out?',
				'Hey ' + id + ' what\'s the release date for Star Wars'
			]
		},
		'search': {
			'name': 'Web Search',
			'description': 'Searches the web for a related link or image',
			'action': 'WebSearch',
			'commands': [
				{
					'command': 'search',
					'params': [{'name': 'search', 'type': type.default}]
				},
				{
					'command': 'image',
					'params': [{'name': 'search', 'type': type.default}],
					'constants': [{'name': 'type', 'value': 'image'}]
				}
			],
			'phrases': [
				id + ' search for England',
				'Hey ' + id + ' look up pictures of dogs'
			]
		},
		'poll': {
			'name': 'Create a Poll',
			'description': 'Creates a poll using reactions. You can specify answers, which can either be multiple "phrases surrounded in quotes" or individual words. You can ask yes/no questions by only specifying a question.',
			'action': 'Poll',
			'commands': [
				{
					'command': 'poll',
					'params': [
						{'name': 'question', 'type': type.phrase},
						{'name': 'answers', 'type': type.array}
					]
				}
			],
			'examples': [
				'poll "How was your day?" "Great!" "Pretty good" "Not good" "Horrible"',
				'poll "What\'s the best fruit?" Apple Banana Orange Tomato',
				'poll Is this a yes or no question?'
			]
		},
		'game': {
			'name': 'Public Service Announcement',
			'description': 'Updates the bot\'s status to to given message.',
			'action': 'Game',
			'commands': [
				{
					'command': 'game',
					'params': [{'name': 'message', 'type': type.default}]
				},
				{
					'command': 'psa',
					'params': [{ 'name': 'message', 'type': type.default }]
				}
			],
			'examples': [
				'game Super Mario World'
			]
		},
		'shakespeare': {
			'name': 'Shakespeare Mode',
			'description': 'Changes the way that the bot speaks to reply as if from a Shakespearean play. This behaves as a toggle and can turn this mode on and off.',
			'action': 'State',
			'commands': [{
					'command': 'shakespeare',
					'constants': [{'name': 'shakespeare', 'value': true}]
				}
			],
			'examples': [
				'shakespeare'
			]
		},
		'pirate': {
			'name': 'Pirate Mode',
			'description': 'Changes the way that the bot speaks to reply as if it were a pirate. This behaves as a toggle and can turn this mode on and off.',
			'action': 'State',
			'commands': [{
					'command': 'pirate',
					'constants': [{'name': 'pirate', 'value': true}]
				}
			],
			'examples': [
				'pirate'
			]
		},
		'owo': {
			'name': 'OwO Mode',
			'description': '<b>Notices bulge</b> OwO What\'s this?',
			'action': 'State',
			'commands': [{
					'command': 'owo',
					'constants': [{'name': 'owo', 'value': true}]
				}
			],
			'examples': [
				'owo'
			]
		},
		'chat': {
			'name': 'Chat/Conversation',
			'description': 'Have a friendly and sometimes sensual conversation',
			'action': 'Cleverbot',
			'commands': [
				{
					'command': '',
					'params': [{'name': 'search', 'type': type.default}]
				}
			],
			'phrases': [
				id + ' how are you?',
				'Hey ' + id + ' you\'re dumb.'
			]
		}
	};

	/**
	 * Returns the feature map with all mentions of botID replaced by a random nickname
	 * @param nicknames List of nicknames to choose from for replacing botID
	 */
	function get(nicknames) {
		if (nicknames) {
			var featureStr = JSON.stringify(features);
			featureStr = featureStr.replace(new RegExp(id, 'g'), (match) => {
				var i = math.randomInt(0, nicknames.length - 1);
				return nicknames[i].charAt(0).toUpperCase() + nicknames[i].slice(1);
			});
			return JSON.parse(featureStr);
		}
		else {
			return features;
		}
	}

	/**
	 * Returns a map of all commands from the feature map using action names as keys
	 */
	function getCommands() {
		var commands = [];
		for (var key in features) {
			if (features[key].commands) {
				var tmpCommands = features[key].commands;
				for (var i in tmpCommands) {
					tmpCommands[i]['action'] = features[key].action;
					commands.push(tmpCommands[i]);
				}
			}
		}
		return commands;
	}

	/**
	 * Returns the type of param associated with its value
	 * @param value Number to search for inside of types map
	 */
	function getType(value) {
		for (var key in type) {
			if (type[key] === value) {
				return key;
			}
		}
		return null;
	}
	return { get, getCommands, getType };
}();
