const path = require('path');
const DiscordClient = require(path.join(__dirname, 'clients/discordClient'));
const config = require(path.join(__dirname, '../json/config.json'));
const credentials = require(path.join(__dirname, '../../credentials/credentials.json'));

module.exports = function() {
	var coffeebean;
	var thelunchcrew;
	var thinkery;
	var clients = [];

	function start() {
		for (var key in config.groups) {
			if (config.groups.hasOwnProperty(key)) {
				var group = config.groups[key];

				for (var clientKey in group.clients) {
					if (clientKey === 'discord') {
						clients.push(new DiscordClient(key, credentials.clients[key][clientKey]));
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
