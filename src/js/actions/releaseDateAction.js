const path = require('path');
const action = require(path.join(__dirname, 'action'));
const bing = require(path.join(__dirname, '../util/bing'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function() {
	var error = new Error([
		'Sorry I was unable to find that release date.',
		'I was unable to find when that\'s released, try rewording it.'
	]);

	function run(req, cb) {
		var params = req.agent.params;
		bing.search(params.search + ' release date', req.client.group, (err, res) => {
			if (err) {
				console.log("ERROR")
				console.log(err)
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
				console.log("ahhh")
				console.log(res)
				action.sendMessage(error.randomError(), req, cb);
			}
		});
	}

	return { run };
}();
