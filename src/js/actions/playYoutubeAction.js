const path = require('path');
const youtubeStream = require('youtube-audio-stream');
const credentials = require(path.join(__dirname, '../../../credentials/credentials.json'));

module.exports = function() {
	const youTube = new YouTube();
	youTube.setKey(credentials.actions.google.key);

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

	}

	function sendResponse(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	return { run };
}();
