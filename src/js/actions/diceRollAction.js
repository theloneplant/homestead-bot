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
		var result = NaN, min = NaN, max = NaN;
		var rollNums = roll.replace(/\s/g,'').split(/[dD]/g);
		var multiplier = parseInt(rollNums[0]);
		var dice = parseInt(rollNums[1]);

		if (!isNaN(dice) && dice > 0 && rollNums.length === 2) {
			if (!isNaN(multiplier) && multiplier > 0) {
				max = multiplier * dice - multiplier + multiplier;
				min = multiplier;
				result = math.randomInt(0, multiplier * dice - multiplier) + multiplier;
			}
			else {
				max = dice - 1 + 1;
				min = 1;
				result = math.randomInt(0, dice - 1) + 1;
			}
		}
		else if (!isNaN(multiplier)) {
			result = min = max = multiplier;
		}
		return { result, min, max };
	}

	function isOperation(str) {
		return str.match(/[+\-*\/^]/g);
	}

	function multiRoll(str) {
		var preroll = str.replace(/\s/g,'');
		var rollArr = preroll.split(/(?=[+\-*\/])/g);
		var resultArr = [];
		var min = 0, max = 0;

		for (var i = 0; i < rollArr.length; i++) {
			var rollResult = NaN;
			var roll = rollArr[i];
			var prefix = roll[0];
			var calcRoll;

			if (isOperation(prefix)) {
				roll = roll.substring(1, roll.length);
				// Calc the roll after the first char and concat the two
				calcRoll = calculateRoll(roll);
				rollResult = prefix + calcRoll.result;
			}
			else {
				calcRoll = calculateRoll(roll);
				rollResult = calcRoll.result;
			}
			min += calcRoll.min;
			max += calcRoll.max;
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
		return createMessage(rollArr.length > 1, preroll, postroll, { result, min, max });
	}

	function defaultRoll() {
		var roll = calculateRoll('d20');
		return createMessage(false, 'd20', '', roll);
	}

	function createMessage(isMulti, preroll, postroll, roll) {
		var steps = postroll && postroll !== '' ? postroll + '\n' + roll.result : roll.result;
		var quality = (roll.result - roll.min) / (roll.max - roll.min);
		return {
			'embed': {
				'title': 'Rolling: ' + preroll,
				'description': '<script>' + steps + '</script>',
				'color': 15015461,
				'thumbnail': {
					'url': 'https://i.imgur.com/XbGsvky.png'
				},
				'fields': [
					{
						'name': 'Your Roll: ' + roll.result,
						'value': rollMessage(quality)
					}
				]
			}
		};
	}

	function rollMessage(quality) {
		if (isNaN(quality)) {
			return 'Congrats you just rolled a constant';
		}
		else if (quality >= 1) {
			return '<b>CRITICAL ROLL</b>';
		}
		else if (quality > 0.75) {
			return 'Excellent roll';
		}
		else if (quality > 0.5) {
			return 'Good roll';
		}
		else if (quality > 0) {
			return 'Poor roll';
		}
		else {
			return 'お前はもう死んでいる';
		}
	}

	function run(req, cb) {
		var params = req.agent.params;
		if (params.roll) {
			try {
				action.sendMessage('', req, cb, multiRoll(params.roll));
			}
			catch (err) {
				action.sendMessage(error.randomError(), req, cb);
			}
		}
		else {
			action.sendMessage('', req, cb, defaultRoll());
		}
	}

	return { run };
}();
