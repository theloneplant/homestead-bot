const path = require('path');
const cleverbotnode = require('cleverbot-node');
const cleverbotio = require('cleverbot.io');
const action = require(path.join(__dirname, 'action'));
const config = require(path.join(__dirname, '../../json/config.json'));
const credentials = require(path.join(__dirname, '../../../credentials/credentials.json'));

module.exports = function() {
	const cbotio = new cleverbotio(credentials.actions.cleverbotio.user, credentials.actions.cleverbotio.key);
	cbotio.setNick(config.botId);
	cbotio.create(function (err, session) {
		cbotio.setNick(session);
	});

	const cbot = new cleverbotnode();
	cbot.configure({ botapi: credentials.actions.cleverbot.token });

	function run(req, cb) {
		cbot.write(req.message, (response) => {
			if (response && response.output) {
				action.sendResponse(response.output, req, cb);
			}
			else {
				console.log('Oh no I\'m dumb');
				cbotio.ask(req.message, (err, response) => {
					if (err) {
						action.sendResponse('I\'m dumb now, talk to me later', req, cb);
					}
					else if (response) {
						action.sendResponse('*Using fallback cleverbot*\n' + response, req, cb);
					}
				});
			}
		});
	}

	return { run };
}();
