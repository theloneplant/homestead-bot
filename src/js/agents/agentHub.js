const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const actionHub = require(path.join(__dirname, '../actions/actionHub'));
const apiaiAgent = require(path.join(__dirname, '../agents/apiaiAgent'));
const randomAgent = require(path.join(__dirname, '../agents/randomAgent'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	var replyAgents = [
		apiaiAgent
	];
	var idleAgents = [
		randomAgent
	];

	function interpret(req, cb) {
		if (!req.to) {
			if (isMentioned(req)) {
				matchAgent(replyAgents, req, (res) => {
					actionHub.run(res, cb);
				});
			}
			else {
				matchAgent(idleAgents, req, (res) => {
					// Only respond if there is a match
					if (res.agent) {
						actionHub.run(res, cb);
					}
				});
			}
		}
		else {
			matchAgent(replyAgents, req, (res) => {
				actionHub.run(res, cb);
			});
		}
	}

	// Loops through all agents in a list and sees if the request matches an action
	function matchAgent(list, req, done, i = 0) {
		if (i < list.length) {
			list[i].interpret(req, (match, res, err) => {
				if (err) {
					console.log('Error: Unable to interpret message "' + res.message + '"');
					matchAgent(list, req, done, ++i);
				}
				if (match) {
					done(res);
				}
				else {
					matchAgent(list, req, done, ++i);
				}
			});
		}
		else {
			// Run the default action
			done(req);
		}
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
