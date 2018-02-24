const path = require('path');
const action = require(path.join(__dirname, 'action'));
const file = require(path.join(__dirname, '../util/file'));
const features = require(path.join(__dirname, '../features'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	function run(req, cb) {
		req.action
		var group = config.groups[req.client.group];
		var prefix = group.agents.command.prefix;
		var featureList = features.get(group.nicknames);
		var feature = req.agent.params.feature;
		var message = [];
		if (feature && feature !== 'help' && featureList[feature]) {
			console.log('match!');
			var messages = [];
			messages.push(buildMessage(prefix, featureList[feature]));
			messages.push('\n<strong>Phrases:</strong>');
			var phrases = featureList[feature].phrases;
			console.log(JSON.stringify(phrases));
			for (var i in phrases) {
				messages.push(phrases[i]);
			}
			action.sendDM(messages.join('\n'), req, cb);
		}
		else {
			var featureArr = [];
			for (var key in featureList) {
				if (key !== 'help') featureArr.push(key);
			}
			var message = buildMessage(prefix, featureList['help'], featureArr.join(', '));
			action.sendDM(message, req, cb);
		}
	}

	function buildMessage(prefix, feature, desc) {
		var messages = [];
		messages.push('<u>' + feature.name + '</u>');
		messages.push(feature.description);
		if (desc) {
			messages.push(desc);
		}
		var commands = feature.commands;
		var commandArr = [];
		for (var i in commands) {
			var commandStr = prefix + commands[i].command;
			if (commands[i].params) {
				for (var j in commands[i].params) {
					commandStr += ' [' + commands[i].params[j] + '] ';
				}
			}
			commandArr.push(commandStr);
		}
		if (commands && commands.length > 1) {
			messages.push('\n<strong>Commands:</strong>');
		}
		else if (commands && commands.length === 1) {
			messages.push('\n<strong>Command:</strong>');
		}
		for (var i in commandArr) {
			messages.push(commandArr[i]);
		}
		return messages.join('\n');
	}

	return { run };
}();
