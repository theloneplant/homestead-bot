const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const Error = require(path.join(__dirname, '../util/error'));
const youTube = require(path.join(__dirname, '../util/youtube'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	var error = new Error([
		'Sorry I couldn\'t find that on YouTube.',
		'I wasn\'t able to find that, try phrasing it differently.',
		'Try asking again, I wasn\'t able to understand what you wanted me to search for.'
	]);

	function run(req, cb) {
		console.log(JSON.stringify(req.agent.params))
		var search = req.agent.params.search;
		var message = req.agent.params.message;
		var mediaControl = req.agent.params.mediaControl;
		if (!search) {
			if (mediaControl === 'play' || mediaControl === 'resume' || mediaControl === 'pause' ||
				mediaControl === 'stop' || mediaControl === 'skip' || mediaControl === 'prev' ||
				mediaControl === 'replay') {
				console.log('send info for music')
				action.sendInfo({'mediaControl': mediaControl}, req, cb);
			}
			else {
				console.log('Invalid media control parameter ' + mediaControl);
				action.sendMessage(error.randomError(), req, cb);
			}
		}
		else {
			youTube.search(search, (err, type, url) => {
				if (err) {
					console.log(err);
					action.sendMessage(error.randomError(), req, cb);
				} else {
					if (type === 'video') {
						var info = {
							'streamUrl': url,
							'streamService': 'youtube'
						}
						if (message) {
							action.sendMessage(message, req, cb);
						}
						else {
							action.sendMessage('Playing a ' + type + ' I found for ' + search + ':\n' + url, req, cb);
						}
						action.sendInfo(info, req, cb);
					} else {
						action.sendMessage('Playing a ' + type + ' is unsupported right now\n' +
							'Here\'s a ' + type + ' I found for ' + search + ':\n' + url, req, cb);
					}
					// TODO: Check and queue other songs if other types
				}
			});
		}
	}

	return { run };
}();
