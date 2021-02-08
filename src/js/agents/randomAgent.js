const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	const MIN_TO_MS = 60000;
	var timeMap = {};

	function interpret(req, done) {
		var randomConfig = config.groups[req.client.group].agents.random;
		if (!timeMap[req.client.group]) {
			timeMap[req.client.group] = Date.now() + randomConfig.maxFrequency * MIN_TO_MS;
		}
		if (Date.now() - timeMap[req.client.group] >= 0) {
			timeMap[req.client.group] = Date.now() + randomConfig.maxFrequency * MIN_TO_MS;
			var actionList = randomConfig.actions;
			for (var i = 0; i < actionList.length; i++) {
				var rand = Math.random();
				if (rand <= actionList[i].chance) {
					req.agent = {
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
