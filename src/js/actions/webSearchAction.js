const path = require('path');
const action = require(path.join(__dirname, 'action'));
const bing = require(path.join(__dirname, '../util/bing'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function() {
	var error = new Error([
		'Sorry I was unable to find that.',
		'I was unable to find that, try rewording it.'
	]);

	function run(req, cb) {
		var params = req.agent.params;
		if (params.type) {
			if (params.type === 'Image') {
				searchImages(params.search, req, cb);
			}
			else {
				action.sendMessage('Sorry I don\'t support ' + params.type + ' searches yet.', req, cb);
			}
		}
		else {
			searchWeb(params.search, req, cb);
		}
	}

	function searchWeb(search, req, cb) {
		bing.search(search, req.client.group, (err, res) => {
			if (err) {
				action.sendMessage(error.randomError(), req, cb);
			}
			else if (res.type === 'answer') {
				if (res.upcoming) {
					action.sendMessage(res.title + ' will be released on ' + res.result, req, cb);
				}
				else {
					action.sendMessage(res.title + ' was released on ' + res.result, req, cb);
				}
			}
			else if (res.type === 'link') {
				var title = res.title.replace(/<strong>|<\/strong>/g, '');
				var result = '<u><strong>' + title + '</strong></u> \n' + res.body + '\n' + res.url;
				action.sendMessage(result, req, cb);
			}
			else {
				action.sendMessage(error.randomError(), req, cb);
			}
		});
	}

	function searchImages(search, req, cb) {
		bing.searchImages(search, req.client.group, (err, imageUrl) => {
			if (err) {
				action.sendMessage(error.randomError(), req, cb);
			}
			else if (imageUrl) {
				action.sendMessage('Here\'s an image I found for ' + search + ':\n' + imageUrl, req, cb);
			}
			else {
				action.sendMessage(error.randomError(), req, cb);
			}
		});
	}

	return { run };
}();
