const path = require('path');
const YouTube = require('youtube-node');
const credentials = require(path.join(__dirname, '../../../credentials/actions.json'));

module.exports = function() {
	const youTube = new YouTube();
	youTube.setKey(credentials.google.key);

	const errorMessages = [
		'Sorry I couldn\'t find that on YouTube.',
		'I wasn\'t able to find that, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to search for.'
	];

	function randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function run(req, cb) {
		console.log('here');
		var params = req.agent.params;
		youTube.search(params.search, 1, function(error, result) {
			if (error) {
				console.log(error);
				sendResponse(errorMessages[randomInt(0, errorMessages.length - 1)], req, cb);
			}
			else {
				if (result.items[0].id.channelId) {
					sendResponse('Here\'s the channel for ' + result.items[0].snippet.title + ':\n' +
						'https://www.youtube.com/channel/' + result.items[0].id.channelId, req, cb);
				}
				else if (result.items[0].id.playlistId) {
					sendResponse('Here\'s a playlist I found for ' + params.search + '\n' +
						'https://www.youtube.com/playlist?list=' + result.items[0].id.playlistId, req, cb);
				}
				else if (result.items[0].id.videoId) {
					sendResponse('Here\'s a video I found for ' + params.search + '\n' +
						'https://www.youtube.com/watch?v=' + result.items[0].id.videoId, req, cb);
				}
				else {
					sendResponse(errorMessages[randomInt(0, errorMessages.length - 1)], req, cb);
				}
				console.log(JSON.stringify(result, null, 2));
				console.log(result);
				console.log(result.items[0].id);
				console.log(result.items[0].id.videoId);
			}
		});
	}

	function sendResponse(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	return { run };
}();
