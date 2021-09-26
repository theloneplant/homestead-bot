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

	// Queue for songs currently playing and history of past songs
	var queue = [];
	var history = [];

	function run(req, cb) {
		console.log(JSON.stringify(req.agent.params))
		var search = req.agent.params.search;
		var message = req.agent.params.message;
		var interrupt = req.agent.params.interrupt;
		var mediaControl = req.agent.params.mediaControl;
		if (interrupt) {
			
		}
		if (!search) {
			if (mediaControl === 'play' || mediaControl === 'pause' ||
				mediaControl === 'stop' || mediaControl === 'skip' ||
				mediaControl === 'replay') {
				console.log('send info for music')
				action.sendInfo({'mediaControl': mediaControl}, req, cb);
			}
			else {
				console.log('Invalid media control parameter ' + mediaControl);
				action.sendMessage(error.randomError(), req, cb);
			}
		}
		else if (queue.length === 0) {
			addMusic(search, message);
			playMusic(search, message, req, cb);
		}
		else {
			addMusic(search, message);
			console.log("adding to queue: " + message);
			action.sendMessage("Added song to queue", req, cb);
		}
	}

	function playMusic(search, message, req, cb) {
		console.log("playing track " + search);
		youTube.search(search, (err, type, url) => {
			if (err) {
				console.log(err);
				action.sendMessage(error.randomError(), req, cb);
				onEnd(req, cb);
			} else {
				if (type === 'video') {
					var startTime = Date.now();
					var info = {
						'streamUrl': url,
						'streamService': 'youtube',
						'timestamp': startTime,
						'onCancel': () => { onInterrupt(url, startTime, req, cb) },
						'onEnd': () => { onEnd(req, cb) }
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
			}
		});
	}

	function onInterrupt(timestamp, req, cb) {
		console.log("Music cancelled")

	}

	function onEnd(req, cb) {
		console.log("Music finished")
		// Remove the current playing track and add it to history
		if (queue.length > 0) {
			console.log("removing current track")
			history.push(queue.shift());
		}
		// Continue with the next track if available
		if (queue.length > 0) {
			console.log("playing next track")
			var node = queue[0];
			playMusic(node.search, node.message, req, cb);
		}
	}

	function addMusic(search, message) {
		var node = {
			'search': search,
			'message': message
		}
		queue.push(node);
		return node;
	}

	return { run };
}();
