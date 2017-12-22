const path = require('path');
const DiscordClient = require(path.join(__dirname, 'clients/discordClient'));
const credentials = require(path.join(__dirname, '../../credentials/clients.json'));

module.exports = function() {
	var coffeebean;
	var thelunchcrew;

	function start() {
		coffeebean = new DiscordClient('coffeebean', credentials.coffeebean);
		thelunchcrew = new DiscordClient('thelunchcrew', credentials.thelunchcrew);
	}
	return { start };
}();
