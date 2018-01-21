const path = require('path');
const ApiAi = require('apiai');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	var apiai = ApiAi(credentials.agents.apiai.token);

	function interpret(req, done) {
		req.message = replaceNicknames(req);
		var request = apiai.textRequest(req.message, {
			sessionId: '1'
		});
		request.on('response', (response) => {
			var agent = {
				'type': 'apiai',
				'output': response.output,
				'action': response.result.action,
				'params': response.result.parameters
			};
			req.agent = agent;
			if (agent.action === 'input.unknown') {
				done(false);
			}
			else {
				done(true, req);
			}
		});
		request.on('error', (err) => {
			console.log(err);
			done(false, req, err);
		});
		request.end();
	}

	function replaceNicknames(req) {
		var nicknames = config.groups[req.client.group].nicknames;
		var message = req.message.replace(config.botId, 'you');
		for(var i in nicknames) {
			message = message.replace(nicknames[i], 'you');
		}
		return message;
	}

	return { interpret }
}();
