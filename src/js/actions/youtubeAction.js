const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const Error = require(path.join(__dirname, '../util/error'));
const youTube = require(path.join(__dirname, '../util/youtube'));
const credentials = file.read(path.join(__dirname, '../../../credentials/credentials.json'));

module.exports = function() {
	var error = new Error([
		'Sorry I couldn\'t find that on YouTube.',
		'I wasn\'t able to find that, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to search for.'
	]);

	function run(req, cb) {
		var search = req.agent.params.search;
		youTube.search(search, (type, url, err) => {
			if (err) {
				console.log(err);
				action.sendMessage(error.randomError(), req, cb);
			}
			else {
				action.sendMessage('Here\'s a ' + type + ' I found for ' + search + ':\n' + url, req, cb);
			}
		});
	}

	return { run };
}();
