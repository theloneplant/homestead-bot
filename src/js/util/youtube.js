const path = require('path');
const YouTube = require('youtube-node');
const file = require(path.join(__dirname, '../util/file'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	const youTube = new YouTube();
	youTube.setKey(credentials.actions.google.token);

	function search(message, cb) {
		youTube.search(message, 1, function(error, result) {
			if (error) {
				console.log(error);
				cb('', '', error);
			}
			else {
				if (result.items[0].id.channelId) {
					cb('channel', 'https://www.youtube.com/channel/' + result.items[0].id.channelId);
				}
				else if (result.items[0].id.playlistId) {
					cb('playlist', 'https://www.youtube.com/playlist?list=' + result.items[0].id.playlistId);
				}
				else if (result.items[0].id.videoId) {
					cb('video', 'https://www.youtube.com/watch?v=' + result.items[0].id.videoId);
				}
				else {
					cb('', '', 'Unable to recognize search result');
				}
			}
		});
	}

	return { search };
}();
