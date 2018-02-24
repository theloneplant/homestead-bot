const path = require('path');
const translate = require('google-translate-api');
const action = require(path.join(__dirname, 'action'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function() {
	var error = new Error([
		'Sorry I couldn\'t translate that.',
		'I wasn\'t able to translate that message, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to translate.'
	]);

	function run(req, cb) {
		var defaultLanguage = 'English';
		var params = req.agent.params;
		var language = params.language || defaultLanguage;
		translate(params.message, {to: language}).then(res => {
			action.sendMessage('Translating ' + params.message + ' to ' + params.language + ':\n' + res.text, req, cb);
		}).catch(err => {
			console.error(err);
			action.sendMessage(error.randomError(), req, cb);
		});
	}

	return { run };
}();
