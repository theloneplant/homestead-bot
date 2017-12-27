const path = require('path');
const diceRollAction = require(path.join(__dirname, 'diceRollAction'));
const youtubeAction = require(path.join(__dirname, 'youtubeAction'));
const translateAction = require(path.join(__dirname, 'translateAction'));
const cleverbotAction = require(path.join(__dirname, 'cleverbotAction'));

module.exports = function() {
	var actionMap = {
		'DiceRoll': diceRollAction,
		'YouTube': youtubeAction,
		'Translate': translateAction
	}
	var defaultAction = cleverbotAction;

	function run(req, cb) {
		console.log(req.agent.action);
		var action = actionMap[req.agent.action];
		if (!action) {
			action = defaultAction;
		}
		action.run(req, cb);
	}
	return { run };
}();
