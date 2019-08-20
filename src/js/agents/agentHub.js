const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const actionHub = require(path.join(__dirname, '../actions/actionHub'));
const apiaiAgent = require(path.join(__dirname, '../agents/apiaiAgent'));
const commandAgent = require(path.join(__dirname, '../agents/commandAgent'));
const dadAgent = require(path.join(__dirname, '../agents/dadAgent'));
const keywordAgent = require(path.join(__dirname, '../agents/keywordAgent'));
const randomAgent = require(path.join(__dirname, '../agents/randomAgent'));
const scheduleAgent = require(path.join(__dirname, '../agents/scheduleAgent'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	var replyAgents = [
		commandAgent,
		apiaiAgent
	];
	var idleAgents = [
		dadAgent,
		keywordAgent,
		randomAgent,
	];
	var startAgents = [
		scheduleAgent
	];

	function start(group, cb) {
		for (var i in startAgents) {
			startAgents[i].start(group, (match, res, err) => {
				if (err) {
					console.error(err);
				}
				if (match) {
					actionHub.run(res, cb);
				}
			});
		}
	}

	function interpret(req, cb) {
		try {
			if (!req.to) {
				if (isMentioned(req)) {
					var res = { 'startTyping': true };
					cb(null, res);
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
		catch (err) {
			console.log(err);
			actionHub.run(req, cb);
		}
	}

	// Loops through all agents in a list and sees if the request matches an action
	function matchAgent(list, req, cb, i = 0) {
		if (i < list.length) {
			list[i].interpret(req, (match, res, err) => {
				if (err) {
					console.log('Error: Unable to interpret message "' + res.message + '"');
					matchAgent(list, req, cb, ++i);
				}
				if (match) {
					cb(res);
				}
				else {
					matchAgent(list, req, cb, ++i);
				}
			});
		}
		else {
			// Run the default action
			cb(req);
		}
	}

	function isMentioned(req) {
		var msgArr = req.message.replace(/[\.,\/@#!?$%\^&\*;:{}=\-_`~()]/g, '').split(/\s/g);
		var nicknames = config.groups[req.client.group].nicknames;
		var prefix = config.groups[req.client.group].agents.command.prefix;
		if (req.message[0] === prefix) {
			return true;
		}
		var flag = false;
		for(var i in msgArr) {
			var word = msgArr[i].toLowerCase();
			for(var j in nicknames) {
				var name = nicknames[j].toLowerCase();
				var contractions = /('?(s|d|ll)('?(s|d|ll|ly|n|t|er|ve|re|all))*)+$/;
				if (word.indexOf(name) === 0 && (word.length === name.length ||
						word.replace(name, '').replace(contractions, '').length === 0)) {
					flag = true;
				}
			}
		}
		return flag;
	}

	return { start, interpret };
}();
