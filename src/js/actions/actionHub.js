const path = require('path');
const diceRollAction = require(path.join(__dirname, 'diceRollAction'));
const cleverbotAction = require(path.join(__dirname, 'cleverbotAction'));

module.exports = function() {
	var actionMap = {
		'DiceRoll': diceRollAction
	}
	var defaultAction = cleverbotAction;

	function run(req, cb) {
		var action = actionMap[req.agent.action];
		if (!action) {
			action = defaultAction;
		}
		action.run(req, cb);
	}
	return { run };
}();
