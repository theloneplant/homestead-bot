const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const features = require(path.join(__dirname, '../features'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	function interpret(req, done) {
		var prefix = config.groups[req.client.group].agents.command.prefix;
		if (req.message[0] === prefix) {
			req.message = req.message.slice(1);
			var messageArray = req.message.split(' ');
			var commands = features.getCommands();
			for (var i in commands) {
				if (messageArray[0] === commands[i].command) {
					var params = getParams(messageArray, commands[i]);
					req.agent = {
						'action': commands[i].action,
						'params': params
					};
					done(true, req);
					return;
				}
			}
		}
		done(false);
	}

	function getParams(messageArray, command) {
		var result = {};
		if (!command) return null;
		if (command.params && messageArray.length > command.params.length) {
			for (var i = 0; i < command.params.length - 1; i++) {
				result[command.params[i]] = messageArray[i + 1];
			}
			var remainingStr = messageArray.slice(command.params.length).join(' ');
			result[command.params[command.params.length - 1]] = remainingStr;
		}
		if (command.constants) {
			for (var key in command.constants) {
				result[key] = command.constants[key];
			}
		}
		return result;
	}

	return { interpret }
}();
