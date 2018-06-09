const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const math = require(path.join(__dirname, '../util/math'));
const reddit = require(path.join(__dirname, '../util/reddit'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	function run(req, cb) {
		var question = req.agent.params.question;
		question = question.charAt(0).toUpperCase() + question.slice(1);
		var answers = req.agent.params.answers;
		var messageArray = [];
		var emoteArray = [];
		if (answers && answers.length > 0) {
			for (var i in answers) {
				if (i >= 9) {
					break;
				}
				var emote = getEmote(parseInt(i) + 1);
				var answer = answers[i].replace(/[\'\"\“\”]/g, '');
				emoteArray.push(emote);
				messageArray.push(emote + ' ' + answer.charAt(0).toUpperCase() + answer.slice(1));
			}
		}
		else {
			emoteArray.push('👍');
			emoteArray.push('👎');
		}
		action.sendMessage('', req, cb, {
			'embed': {
				'title': question,
				'description': messageArray.join('\n'),
				'color': 11360442,
				"footer": {
					"text": "Vote by reacting!"
				}
			},
			'emotes': emoteArray
		});
	}

	function getEmote(number) {
		console.log(number)
		console.log(typeof number)
		if (number === 0) { return '0⃣'; }
		else if (number === 1) { return '1⃣'; }
		else if (number === 2) { return '2⃣'; }
		else if (number === 3) { return '3⃣'; }
		else if (number === 4) { return '4⃣'; }
		else if (number === 5) { return '5⃣'; }
		else if (number === 6) { return '6⃣'; }
		else if (number === 7) { return '7⃣'; }
		else if (number === 8) { return '8⃣'; }
		else if (number === 9) { return '9⃣'; }
		else { return null; }
	}

	return { run };
}();
