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
		//apiaiAgent
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
					console.log("matching reply agent mentioned: " + JSON.stringify(req))
					matchAgent(replyAgents, req, (res) => {
						actionHub.run(res, cb);
					});
				}
				else {
					console.log("matching idle agents");
					matchAgent(idleAgents, req, (res) => {
						// Only respond if there is a match
						console.log("matched agent: " + res.agent);
						if (res.agent) {
							actionHub.run(res, cb);
						}
						else {
							console.log("No idle agent was matched");
						}
					});
				}
			}
			else {
				console.log("matching reply agents")
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
		console.log("matching agent " + i);
		if (i < list.length) {
			list[i].interpret(req, (match, res, err) => {
				if (err) {
					console.log('Error: Unable to interpret message "' + res.message + '"');
					console.log(err)
					matchAgent(list, req, cb, ++i);
				}
				if (match) {
					console.log("found matching agent");
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
		console.log('message prefix: ' + req.message[0] + ', prefix: ' + prefix)
		var msgArr = req.message.replace(/[\.,\/@#?!$%\^&\*;:{}=\-_`~()]/g, '').split(/\s/g);
		var nicknames = config.groups[req.client.group].nicknames;
		var prefix = config.groups[req.client.group].agents.command.prefix;
		console.log("here");
		if (req.message[0] === prefix || req.isMentioned) {
			console.log("I was mentioned... " + req.isMentioned);
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
					console.log("I was mentionedddd ");
				}
			}
		}
		return flag;
	}

	return { start, interpret };
}();
