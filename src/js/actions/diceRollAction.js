const path = require('path');
const action = require(path.join(__dirname, 'action'));
const math = require(path.join(__dirname, '../util/math'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function() {
	var error = new Error([
		'I can\'t tell what you want me to roll',
		'Could you try wording that differently?',
		'I couldn\'t understand your roll, try saying it differently'
	]);

	function calculateRoll(roll) {
		var result = NaN;
		var rollNums = roll.replace(/\s/g,'').split(/[dD]/g);
		var multiplier = parseInt(rollNums[0]);
		var dice = parseInt(rollNums[1]);

		if (!isNaN(dice) && dice > 0 && rollNums.length === 2) {
			if (!isNaN(multiplier) && multiplier > 0) {
				result = math.randomInt(0, multiplier * dice - multiplier) + multiplier;
			}
			else {
				result = math.randomInt(0, dice - 1) + 1;
			}
		}
		else if (!isNaN(multiplier)) {
			result = multiplier;
		}
		return result;
	}

	function isOperation(str) {
		return str.match(/[+\-*\/^]/g);
	}

	function multiRoll(str) {
		var preroll = str.replace(/\s/g,'');
		var rollArr = preroll.split(/(?=[+\-*\/])/g);
		var resultArr = [];

		for (var i = 0; i < rollArr.length; i++) {
			var rollResult = NaN;
			var roll = rollArr[i];
			var prefix = roll[0];
			if (isOperation(prefix)) {
				roll = roll.substring(1, roll.length);
				// Calc the roll after the first char and concat the two
				rollResult = prefix + calculateRoll(roll);
			}
			else {
				rollResult = calculateRoll(roll) + '';
			}
			resultArr.push(rollResult);
		}

		var postroll = resultArr.join('');
		try {
			result = eval(postroll);
		}
		catch(err) {}

		if (isNaN(result)) {
			throw NaN;
		}
		return createMessage(rollArr.length > 1, preroll, postroll, result);
	}

	function defaultRoll() {
		var roll = calculateRoll('d20');
		return createMessage(false, 'd20', '', roll);
	}

	function createMessage(isMulti, preroll, postroll, result) {
		if (isMulti) {
			return 'Rolling: ' + preroll + '\n' +
			postroll + '\n' +
			'You rolled ' + result + '!';
		}
		else {
			return 'Rolling: ' + preroll + '\n' +
			'You rolled ' + result + '!';
		}
	}

	function run(req, cb) {
		var params = req.agent.params;
		if (params.roll) {
			console.log(params.roll)
			try {
				action.sendMessage(multiRoll(params.roll), req, cb);
			}
			catch (err) {
				action.sendMessage(error.randomError(), req, cb);
			}
		}
		else {
			action.sendMessage(defaultRoll(), req, cb);
		}
	}

	return { run };
}();
