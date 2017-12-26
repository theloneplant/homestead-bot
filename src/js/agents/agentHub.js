const path = require('path');
const config = require(path.join(__dirname, '../../json/config.json'));
const apiaiAgent = require(path.join(__dirname, '../agents/apiaiAgent'));

module.exports = function() {
	function interpret(req, cb) {
		if (!req.to) {
			if (isMentioned(req)) {
				mapInterpret(req, cb);
			}
			else {
				// Ignore the call since the bot wasn't mentioned
				cb();
			}
		}
		else {
			mapInterpret(req, cb);
		}
	}

	function mapInterpret(req, cb) {
		apiaiAgent.interpret(req, cb);
	}

	function isMentioned(req) {
		var msgArr = req.message.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').split(/\s/g);
		var nicknames = config.groups[req.client.group].nicknames;
		var flag = false;
		for(var i in msgArr) {
			var word = msgArr[i].toLowerCase();
			for(var j in nicknames) {
				var name = nicknames[j].toLowerCase();
				if (word === name) {
					flag = true;
				}
			}
		}
		return flag;
	}

	return { interpret };
}();
