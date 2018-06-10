const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	function interpret(req, done) {
		var dadConfig = config.groups[req.client.group].agents.dad;
		if (dadConfig.enabled && req && req.message) {
			var matches = req.message.match(/\b(([Ii]\s+[Aa][Mm])|([Ii]['‘’]?[Mm]))\s+\S+\s*$/gm);
			if (matches && matches.length > 0) {
				var names = matches[0].trim().split(/\s/g);
				var name = names[names.length - 1].trim();
				name = name.charAt(0).toUpperCase() + name.slice(1);
				req.agent = {
					'action': 'SendMessage',
					'params': {
						'message': 'Hi ' + name + ', I\'m ' + dadConfig.name + '!',
						'private': false
					}
				};
				done(true, req);
				return;
			}
		}
		done(false);
	}

	return { interpret }
}();
