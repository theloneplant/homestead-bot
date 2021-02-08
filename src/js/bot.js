const path = require('path');
const file = require(path.join(__dirname, 'util/file'));
const DiscordClient = require(path.join(__dirname, 'clients/discordClient'));
const config = file.read(path.join(__dirname, '../../config/server.json'));
const credentials = file.read(path.join(__dirname, '../../config/credentials.json'));

module.exports = function() {
	var clients = [];

	function start() {
		console.log("ahahahaha")
		for (var key in config.groups) {
			if (config.groups.hasOwnProperty(key)) {
				for (var clientKey in config.groups[key].clients) {
					if (clientKey === 'discord') {
						try {
							console.log("woo boy howdy1")
							clients.push(new DiscordClient(key, credentials.clients[key][clientKey]));

						} catch(e) {
							console.log("woo boy howdy")
							console.log(e)
						}
					}
					else {
						// Do nothing
						console.log('Unable to find client "' + clientKey + '"');
					}
				}
			}
		}
	}
	return { start };
}();
