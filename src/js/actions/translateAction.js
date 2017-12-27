const path = require('path');
const Translate = require('google-translate-api');
const credentials = require(path.join(__dirname, '../../../credentials/actions.json'));

module.exports = function() {
	const errorMessages = [
		'Sorry I couldn\'t translate that.',
		'I wasn\'t able to translate that message, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to translate.'
	];

	function randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function run(req, cb) {
		var params = req.agent.params;
		var language = params.language || 'en';
		Translate(params.message, {to: language}).then(res => {
			sendResponse('Translating "' + params.message + '" to ' + params.language + '\n' + res.text, req, cb);
		}).catch(err => {
			console.error(err);
			sendResponse(errorMessages[randomInt(0, errorMessages.length - 1)], req, cb);
		});
	}

	function sendResponse(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	return { run };
}();
