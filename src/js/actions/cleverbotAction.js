const path = require('path');
const cleverbotnode = require('cleverbot-node');
const cleverbotio = require('cleverbot.io');
const config = require(path.join(__dirname, '../../json/config.json'));
const credentials = require(path.join(__dirname, '../../../credentials/actions.json'));

module.exports = function() {
	const cbotio = new cleverbotio(credentials.cleverbotio.user, credentials.cleverbotio.key);
	cbotio.setNick(config.botId);
	cbotio.create(function (err, session) {
		cbotio.setNick(session);
	});

	const cbot = new cleverbotnode();
	cbot.configure({ botapi: credentials.cleverbot.token });

	function run(req, cb) {
		cbot.write(req.message, (response) => {
			if (response && response.output) {
				sendResponse(response.output, req, cb);
			}
			else {
				console.log('Oh no I\'m dumb');
				cbotio.ask(req.message, (err, response) => {
					if (err) {
						sendResponse('I\'m dumb now, talk to me later', req, cb);
					}
					else if (response) {
						sendResponse('*Using fallback cleverbot*\n' + response, req, cb);
					}
				});
			}
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
