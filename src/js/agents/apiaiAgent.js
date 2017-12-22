const path = require('path');
const ApiAi = require('apiai');
const config = require(path.join(__dirname, '../../json/config.json'));
const credentials = require(path.join(__dirname, '../../../credentials/agents.json'));
const agentHub = require(path.join(__dirname, 'agentHub'));

module.exports = function() {
	var apiaiAgent = ApiAi(credentials.apiai.client_token);

	function interpret(req, cb) {
		var message = req.message.replace(config.botId, 'you');
		var request = apiaiAgent.textRequest(message, {
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
			const agentHub = require(path.join(__dirname, 'agentHub'));
			agentHub.run(req, cb);
		});
		request.on('error', (error) => {
			console.log('oof ouch owie');
			cb();
		});
		request.end();
	}
	return { interpret }
}();
