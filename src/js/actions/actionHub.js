const path = require('path');
const diceRollAction = require(path.join(__dirname, 'diceRollAction'));
const youtubeAction = require(path.join(__dirname, 'youtubeAction'));
const playMusicAction = require(path.join(__dirname, 'playMusicAction'));
const translateAction = require(path.join(__dirname, 'translateAction'));
const memeAction = require(path.join(__dirname, 'memeAction'));
const cleverbotAction = require(path.join(__dirname, 'cleverbotAction'));

module.exports = function() {
	var actionMap = {
		'DiceRoll': diceRollAction,
		'YouTube': youtubeAction,
		'PlayMusic': playMusicAction,
		'Translate': translateAction,
		'PostMeme': memeAction,
		'Cleverbot': cleverbotAction
	}
	var defaultAction = cleverbotAction;

	function run(req, cb) {
		var action;
		if (req && req.agent) {
			console.log(req.agent.action);
			action = actionMap[req.agent.action];
			if (!action) {
				action = defaultAction;
			}
		}
		else {
			console.log('default action');
			action = defaultAction;
		}
		console.log(cb);
		action.run(req, cb);
	}
	return { run };
}();
