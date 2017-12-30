const path = require('path');
const youtubeStream = require('youtube-audio-stream');
const action = require(path.join(__dirname, 'action'));
const credentials = require(path.join(__dirname, '../../../credentials/credentials.json'));

module.exports = function() {
	var error = new Error([
		'Sorry I couldn\'t find that on YouTube.',
		'I wasn\'t able to find that, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to search for.'
	]);

	function run(req, cb) {
		// TODO
	}

	return { run };
}();
