const path = require('path');
const cleverbotnode = require('cleverbot-node');
const cleverbotio = require('cleverbot.io');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));
const credentials = file.read(path.join(__dirname, '../../../credentials/credentials.json'));

module.exports = function() {
	const cbotio = new cleverbotio(credentials.actions.cleverbotio.user, credentials.actions.cleverbotio.token);
	cbotio.setNick(config.botId);
	cbotio.create(function (err, session) {
		cbotio.setNick(session);
	});

	const cbot = new cleverbotnode();
	cbot.configure({ botapi: credentials.actions.cleverbot.token });

	function run(req, cb) {
		cbot.write(req.message, (response) => {
			if (response && response.output) {
				action.sendMessage(response.output, req, cb);
			}
			else {
				console.log('Oh no I\'m dumb');
				cbotio.ask(req.message, (err, response) => {
					if (err) {
						action.sendMessage('I\'m dumb now, talk to me later', req, cb);
					}
					else if (response) {
						action.sendMessage('*Using fallback cleverbot*\n' + response, req, cb);
					}
				});
			}
		});
	}

	return { run };
}();
