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

				for (var i in group.clients) {
					var client = group.clients[i];
					if (client === 'discord') {
						console.log(key);
						console.log(client);
						clients.push(new DiscordClient(key, credentials.clients[key][client]));
						console.log('Clients length: ' + clients.length);
					}
					else {
						// Do nothing
						console.log('Unable to find client "' + client + '"');
					}
				}
			}
		}
	}
	return { start };
}();
