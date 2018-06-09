const path = require('path');
const action = require(path.join(__dirname, 'action'));
const file = require(path.join(__dirname, '../util/file'));
const features = require(path.join(__dirname, '../features'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	function run(req, cb) {
		var group = config.groups[req.client.group];
		var prefix = group.agents.command.prefix;
		var featureList = features.get(group.nicknames);
		var feature = req.agent.params.feature;
		if (feature && feature !== 'help' && featureList[feature]) {
			var params = buildMessage(prefix, featureList[feature]);
			action.sendDM('', req, cb, params);
		}
		else {
			var featureArr = [];
			for (var key in featureList) {
				if (key !== 'help') featureArr.push(key);
			}
			var params = buildMessage(prefix, featureList['help'], '<b>' + featureArr.join('</b> | <b>') + '</b>');
			action.sendDM('', req, cb, params);
		}
	}

	function buildMessage(prefix, feature, desc) {
		desc = desc ? '\n' + desc : '';
		var embed = {};
		embed.title = '<u>' + feature.name + '</u>';
		embed.description = feature.description + desc + '\n\u200b';
		embed.color = 4359924;
		var commands = feature.commands;
		var examples = feature.examples;
		var phrases = feature.phrases;
		var commandArr = [];
		for (var i in commands) {
			var commandStr = prefix + commands[i].command;
			if (commands[i].params) {
				for (var j in commands[i].params) {
					commandStr += ' [' + commands[i].params[j].name + '] ';
				}
			}
			commandArr.push(commandStr);
		}
		embed.fields = [];
		if (commands && commands.length > 0) {
			var commandTitle = commands.length > 1 ? 'Commands:' : 'Command:';
			var spacing = (examples && examples.length) || (phrases && phrases.length) > 0 ? '\n\u200b' : '';
			embed.fields.push({
				name: commands.length > 1 ? 'Commands:' : 'Command:',
				value: commandArr.join('\n') + spacing
			});
		}
		if (examples && examples.length > 0) {
			var spacing = phrases && phrases.length > 0 ? '\n\u200b' : '';
			for (var i in examples) {
				examples[i] = prefix + examples[i];
			}
			embed.fields.push({
				name: examples.length > 1 ? 'Examples:' : 'Example:',
				value: examples.join('\n') + spacing
			});
		}
		if (phrases && phrases.length > 0) {
			embed.fields.push({
				name: phrases.length > 1 ? 'Phrases:' : 'Phrase:',
				value: phrases.join('\n') + '\n\u200b'
			});
			embed.footer = {
				text: 'Phrases are flexible and can be worded in multiple ways, try it out!'
			}
		}
		return { embed };
	}

	return { run };
}();
