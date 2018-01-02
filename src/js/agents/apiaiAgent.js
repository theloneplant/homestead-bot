const path = require('path');
const ApiAi = require('apiai');
const config = require(path.join(__dirname, '../../json/config.json'));
const credentials = require(path.join(__dirname, '../../../credentials/credentials.json'));
const actionHub = require(path.join(__dirname, '../actions/actionHub'));

module.exports = function() {
	var apiai = ApiAi(credentials.agents.apiai.token);

	function interpret(req, cb) {
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
			actionHub.run(req, cb);
		});
		request.on('error', (error) => {
			console.log('oof ouch owie');
			cb();
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
