const path = require('path');
const file = require(path.join(__dirname, 'util/file'));
const math = require(path.join(__dirname, 'util/math'));
const config = file.read(path.join(__dirname, '../../config/server.json'));

module.exports = function() {
	var id = config.botId;
	var features = {
		'help': {
			'name': 'Help',
			'description': 'To get help with a specific feature, specify one of the following in the help command:',
			'action': 'Help',
			'commands': [
				{
					'command': 'help',
					'params': ['feature']
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
					'params': ['roll']
				}
			],
			'phrases': [
				id + ' roll',
				'Hey ' + id + ' roll 3d6 + d4 - 1',
			]
		},
		'youtube': {
			'name': 'YouTube Search',
			'description': 'Searches YouTube for a video and posts the top result in chat',
			'action': 'YouTube',
			'commands': [
				{
					'command': 'youtube',
					'params': ['search']
				},
				{
					'command': 'video',
					'params': ['search']
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
					'params': ['search']
				}
			],
			'phrases': [
				id + ' play [search]',
				'Hey ' + id + ' play [search] on YouTube'
			]
		},
		'translate': {
			'name': 'Translate',
			'description': 'Translates text into the desired language (English is default)',
			'action': 'Translate',
			'commands': [
				{
					'command': 'translate',
					'params': ['language', 'message']
				}
			],
			'phrases': [
				id + ' search YouTube for [search]',
				'Hey ' + id + ' look up [search] on YouTube'
			]
		},
		'meme': {
			'name': 'Meme Posting',
			'description': 'Posts a dank meme',
			'action': 'PostMeme',
			'commands': [
				{
					'command': 'meme'
				}
			],
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
					'params': ['search']
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
					'params': ['search']
				},
				{
					'command': 'image',
					'params': ['search'],
					'constants': {
						'type': 'Image'
					}
				}
			],
			'phrases': [
				id + ' search for England',
				'Hey ' + id + ' look up pictures of dogs'
			]
		},
		'chat': {
			'name': 'Chat/Conversation',
			'description': 'Have a friendly and sometimes sensual conversation\n/[message]',
			'action': 'Cleverbot',
			'phrases': [
				id + ' how are you?',
				'Hey ' + id + ' you\'re dumb.'
			]
		}
	};

	function get(nicknames) {
		if (nicknames) {
			var featureStr = JSON.stringify(features);
			featureStr = featureStr.replace(new RegExp(id, 'g'), (match) => {
				var i = math.randomInt(0, nicknames.length - 1);
				return nicknames[i].charAt(0).toUpperCase() + nicknames[i].slice(1);;
			});
			return JSON.parse(featureStr);
		}
		else {
			return features;
		}
	}

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
	return { get, getCommands };
}();
