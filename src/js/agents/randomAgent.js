const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	const MS_TO_MIN = 60000;
	var timeMap = {};

	function interpret(req, done) {
		var randomConfig = config.groups[req.client.group].agents.random;
		if (!timeMap[req.client.group]) {
			timeMap[req.client.group] = Date.now() - randomConfig.maxFrequency * MS_TO_MIN;
		}
		if (Date.now() - timeMap[req.client.group] >= randomConfig.maxFrequency * MS_TO_MIN) {
			var actionList = randomConfig.actions;
			for (var i = 0; i < actionList.length; i++) {
				var rand = Math.random();
				console.log('rand: ' + rand + ' ' + actionList[i].chance);
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
