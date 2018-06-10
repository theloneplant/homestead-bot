const path = require('path');
const helpAction = require(path.join(__dirname, 'helpAction'));
const diceRollAction = require(path.join(__dirname, 'diceRollAction'));
const coinFlipAction = require(path.join(__dirname, 'coinFlipAction'));
const youtubeAction = require(path.join(__dirname, 'youtubeAction'));
const playMusicAction = require(path.join(__dirname, 'playMusicAction'));
const translateAction = require(path.join(__dirname, 'translateAction'));
const memeAction = require(path.join(__dirname, 'memeAction'));
const releaseDateAction = require(path.join(__dirname, 'releaseDateAction'));
const sendMessageAction = require(path.join(__dirname, 'sendMessageAction'));
const stateAction = require(path.join(__dirname, 'stateAction'));
const webSearchAction = require(path.join(__dirname, 'webSearchAction'));
const pollAction = require(path.join(__dirname, 'pollAction'));
const gameAction = require(path.join(__dirname, 'gameAction'));
const cleverbotAction = require(path.join(__dirname, 'cleverbotAction'));

module.exports = function() {
	var actionMap = {
		'Help': helpAction,
		'DiceRoll': diceRollAction,
		'CoinFlip': coinFlipAction,
		'YouTube': youtubeAction,
		'PlayMusic': playMusicAction,
		'Translate': translateAction,
		'PostMeme': memeAction,
		'ReleaseDate': releaseDateAction,
		'SendMessage': sendMessageAction,
		'State': stateAction,
		'WebSearch': webSearchAction,
		'Poll': pollAction,
		'Game': gameAction,
		'Cleverbot': cleverbotAction
	};
	var defaultAction = cleverbotAction;

	function run(req, cb) {
		var action;
		if (req && req.agent) {
			action = actionMap[req.agent.action];
			if (!action) {
				action = defaultAction;
			}
		}
		else {
			action = defaultAction;
		}
		try {
			action.run(req, cb);
		}
		catch(err) {
			console.log(err);
		}
	}

	return { run };
}();
