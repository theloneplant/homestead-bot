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
			var msgParams = {
				'targetUser': params.targetUser
			};
			if (params.private) {
				action.sendDM(params.message, req, cb, msgParams);
			}
			else {
				action.sendMessage(params.message, req, cb, msgParams);
			}
		}
		else {
			console.log('No message was given, returning error message');
			action.sendMessage(error.randomError(), req, cb);
		}
	}

	return { run };
}();
