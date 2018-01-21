const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const math = require(path.join(__dirname, '../util/math'));
const reddit = require(path.join(__dirname, '../util/reddit'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
	var groupWeights = {};

	function run(req, cb) {
		var memeList = config.groups[req.client.group].actions.meme;
		if (!groupWeights[req.client.group]) {
			var totalWeight = 0;
			for (var i = 0; i < memeList.length; i++) {
				totalWeight += memeList[i].weight;
			}
			groupWeights[req.client.group] = totalWeight;
		}
		// Weighted chance for each subreddit
		var rand = math.randomRange(0, groupWeights[req.client.group]);
		var minWeight = 0;
		for (var i = 0; i < memeList.length; i++) {
			if (memeList[i].weight + minWeight >= rand) {
				// TODO: Error handling
				console.log(rand)
				console.log(memeList[i].subreddit)
				reddit.getPost(memeList[i].subreddit, req, (post) => {
					action.sendMessage(post.title + '\n' + post.url, req, cb);
				});
				break;
			}
			else {
				minWeight += memeList[i].weight;
			}
		}
	}

	return { run };
}();
