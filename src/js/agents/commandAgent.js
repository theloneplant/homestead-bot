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
					var params = getParams(messageArray.slice(1).join(' '), commands[i]);
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

	function getParams(message, command) {
		var result = {};
		if (!command) return null;
		if (message && command.params) {
			for (var i in command.params) {
				var type = features.getType(command.params[i].type);
				var name = command.params[i].name
				if (message.length === 0) break;
				console.log('CRAAAAAWLING IN MY SKIIIN')
				if (type === 'default') {
					console.log('default')
					console.log(command.params.length)
					console.log(i++)
					if (i++ === command.params.length) {
						// Last param, get remaining string
						console.log('remaining string')
						result[name] = message;
						message = '';
					}
					else {
						// Get single word
						console.log('only one word')
						message = message.split(' ');
						result[name] = message[0];
						message = message.slice(1).join(' ');
					}
				}
				else if (type === 'phrase') {
					if (message[0].match(/["“”]/g)) {
						// If first character is quote, look for matching quote/remaining message
						var array = message.match(/["“”].*?["“”]/g);
						if (array.length === 0) {
							result[name] = message.replace(/["“”]/g, '');
							message = '';
						}
						else {
							result[name] = array[0].replace(/["“”]/g, '');
							message = message.replace(/["“”].*?["“”]\s*/, '');
						}
					}
					else {
						// Match remaining message
						result[name] = message;
						message = '';
					}
				}
				else if (type === 'array') {
					if (message[0].match(/["“”]/g)) {
						// Match remaining message as phrases
						var arr = message.match(/["“”].*?["“”]/g);
						for (var i in arr) {
							arr[i] = arr[i].replace(/["“”]/g, '');
						}
						result[name] = arr;
						message = '';
					}
					else {
						// Match remaining message as defaults
						result[name] = message.split(' ');
						message = '';
					}
				}
				else {
					return null;
				}
			}
		}
		if (command.constants) {
			for (var i in command.constants) {
				result[command.constants[i].name] = command.constants[i].value;
			}
		}
		return result;
	}

	return { interpret }
}();
