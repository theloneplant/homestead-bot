const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
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
	var currentTrack;
	var queue = [];
	var history = [];

	function run(req, cb) {
		console.log(JSON.stringify(req.agent.params))
		var search = req.agent.params.search;
		var volume = req.agent.params.volume;
		var message = req.agent.params.message;
		var interrupt = req.agent.params.interrupt;
		var mediaControl = req.agent.params.mediaControl;

		if (interrupt) {
			console.log('playing now')
			playNow(search, volume, message, req, cb);
		}
		else if (!search) {
			if (mediaControl === 'play' || mediaControl === 'resume' ||
				mediaControl === 'pause' || mediaControl === 'replay') {
				console.log('send info for music')
				action.sendInfo({'mediaControl': mediaControl}, req, cb);
			}
			else if (mediaControl === 'stop') {
				queue = [];
				action.sendInfo({'mediaControl': mediaControl}, req, cb);
			}
			else if (mediaControl === 'next') {
				if (queue.length === 0) {
					action.sendMessage("No more songs left in the queue", req, cb);
					action.sendInfo({'mediaControl': 'stop'}, req, cb);
				}
				playNext(req, cb);
			}
			else {
				console.log('Invalid media control parameter ' + mediaControl);
				action.sendMessage(error.randomError(), req, cb);
			}
		}
		else if (queue.length === 0 && !currentTrack) {
			console.log('empty queue');
			addMusic(search, volume, message);
			playNext(req, cb);
		}
		else {
			console.log("adding to queue: " + message);
			addMusic(search, volume, message);
			action.sendMessage("Added song to queue", req, cb);
		}
	}

	function playNow(search, volume, message, req, cb) {
		console.log('adding music to queue ' + queue.length)
		addMusicNext(search, volume, message);
		console.log('playing next track ' + JSON.stringify(queue[0]))
		playNext(req, cb);
	}

	function playNext(req, cb) {
		// Easier name for what onEnd does
		onEnd(req, cb);
	}

	function playMusic(search, volume, message, req, cb) {
		console.log("playing track " + search);
		// TODO: Update name to include date and rotate cache files
		// Check cache first, and skip youtube request if it exists
		var filename = path.join(__dirname, '../../../cache/' + escape(search) + '.mp4');
		var tmpFilename = path.join(__dirname, '../../../cache/' + escape(search) + '-temp.mp4');
		if (fs.existsSync(filename)) {
			fs.rm(tmpFilename, () => {
				console.log('removed temp file ' + tmpFilename)
			});
			console.log('audio cache already exists, skipping download');
			var startTime = Date.now();
			var info = {
				'search': search,
				'volume': volume,
				'filename': filename,
				'streamService': 'youtube',
				'timestamp': startTime,
				'onCancel': () => { onCancel(url, startTime, req, cb) },
				'onEnd': () => { onEnd(req, cb) }
			}
			if (message) {
				action.sendMessage(message, req, cb);
			}
			else {
				action.sendMessage('Playing a song I found for ' + search, req, cb);
			}
			action.sendInfo(info, req, cb);
			console.log('filename of cache: ' + filename);
			return;
		}

		// Then search YouTube if it isn't available
		youTube.search(search, (err, type, url) => {
			if (err) {
				console.log(err);
				action.sendMessage(error.randomError(), req, cb);
				onEnd(req, cb);
			} else {
				var urlList = url && url.split('?v=');
				var id = urlList && urlList[1];
				console.log('video id: ' + id);
				var filename = path.join(__dirname, '../../../cache/' + escape(id) + '.mp4');
				var tmpFilename = path.join(__dirname, '../../../cache/' + escape(id) + '-temp.mp4');
				var stream = ytdl(id);
				stream.pipe(fs.createWriteStream(tmpFilename));
				stream.on('end', () => {
					console.log('finished caching file ' + filename);
					fs.copyFileSync(tmpFilename, filename);
					console.log('done copying file, removing temp');
					fs.rm(tmpFilename, () => {});

					console.log('starting youtube track from file ' + filename);
					if (type === 'video') {
						var startTime = Date.now();
						var info = {
							'search': search,
							'volume': volume,
							'filename': filename,
							'streamService': 'youtube',
							'timestamp': startTime,
							'onCancel': () => { onCancel(url, startTime, req, cb) },
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
				});
			}
		});
	}

	function onCancel(timestamp, req, cb) {
		console.log("Music cancelled")

	}

	function onEnd(req, cb) {
		console.log("Music finished")
		// Remove the current playing track and add it to history
		if (currentTrack) {
			console.log("removing current track")
			history.push(currentTrack);
			currentTrack = undefined;
			action.sendInfo({'mediaControl': 'stop'}, req, cb);
		}
		// Continue with the next track if available
		if (queue.length > 0) {
			currentTrack = queue.shift();
			console.log('got next track: ' + JSON.stringify(currentTrack))
			if (currentTrack) {
				console.log("playing next track");
				playMusic(currentTrack.search, currentTrack.volume, currentTrack.message, req, cb);
			}
		}
	}

	function addMusicNext(search, volume, message) {
		var musicSearch = {
			'search': search,
			'volume': volume,
			'message': message
		}
		queue.unshift(musicSearch);
		console.log('added music to front ' + queue.length + ', ' + queue[0])
		return musicSearch;
	}

	function addMusic(search, volume, message) {
		var musicSearch = {
			'search': search,
			'volume': volume,
			'message': message
		}
		queue.push(musicSearch);
		return musicSearch;
	}

	return { run };
}();
