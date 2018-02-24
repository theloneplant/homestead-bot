const path = require('path');
const helpAction = require(path.join(__dirname, 'helpAction'));
const diceRollAction = require(path.join(__dirname, 'diceRollAction'));
const youtubeAction = require(path.join(__dirname, 'youtubeAction'));
const playMusicAction = require(path.join(__dirname, 'playMusicAction'));
const translateAction = require(path.join(__dirname, 'translateAction'));
const memeAction = require(path.join(__dirname, 'memeAction'));
const releaseDateAction = require(path.join(__dirname, 'releaseDateAction'));
const webSearchAction = require(path.join(__dirname, 'webSearchAction'));
const cleverbotAction = require(path.join(__dirname, 'cleverbotAction'));

module.exports = function() {
	var actionMap = {
		'Help': helpAction,
		'DiceRoll': diceRollAction,
		'YouTube': youtubeAction,
		'PlayMusic': playMusicAction,
		'Translate': translateAction,
		'PostMeme': memeAction,
		'ReleaseDate': releaseDateAction,
		'WebSearch': webSearchAction,
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
