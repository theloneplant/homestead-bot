const path = require('path');
const translate = require('google-translate-api');
const action = require(path.join(__dirname, 'action'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function() {
	var error = new Error([
		'Sorry, could you try phrasing that differently?',
		'I couldn\'t understand what you said.'
	]);

	function run(req, cb) {
		var params = req.agent.params;
		if (params && params.message) {
			action.sendMessage('The public service announcement will be updated shortly', req, cb, {
				'statusText': params.message,
				'temp': true
			});
		}
		else {
			console.log('No message was given, returning error message');
			action.sendMessage(error.randomError(), req, cb);
		}
	}

	return { run };
}();
