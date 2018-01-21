const path = require('path');
const ApiAi = require('apiai');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	// Minimum delay between posts (5 min)
	const POST_DELAY = 300000;
	var timeMap = {};

	function interpret(req, done) {
		if (!timeMap[req.client.group]) {
			timeMap[req.client.group] = Date.now() - POST_DELAY;
		}
		if (Date.now() - timeMap[req.client.group] >= POST_DELAY) {
			var actionList = config.groups[req.client.group].agents.random;
			for (var i = 0; i < actionList.length; i++) {
				var rand = Math.random();
				console.log('rand: ' + rand + ' ' + actionList[i].chance);
				if (rand <= actionList[i].chance) {
					req.agent = {
						'type': 'random',
						'action': actionList[i].action,
						'params': actionList[i].params
					};
					timeMap[req.client.group] = Date.now();
					done(true, req);
					return;
				}
			}
		}
		done(false);
	}

	return { interpret }
}();
