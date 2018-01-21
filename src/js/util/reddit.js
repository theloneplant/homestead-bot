const path = require('path');
const rawjs = require('raw.js');
const file = require(path.join(__dirname, '../util/file'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	var login = {
		'username': credentials.actions.reddit.username,
		'password': credentials.actions.reddit.password
	}
	var postMap = {};
	var reddit = new rawjs(credentials.actions.reddit.userAgent);
	reddit.setupOAuth2(credentials.actions.reddit.clientId, credentials.actions.reddit.clientSecret);
	reddit.auth(login, (err, res) => {
		if(err) {
			console.log("Unable to authenticate user: " + err);
		}
	});

	function getPost(subreddit, req, done, age = 'day', retry = 5) {
		reddit.top({r: subreddit, t: age}, (err, res) => {
			if (err) {
				if (retry > 0) {
					getPost(subreddit, done, age, --retry);
				}
				else {
					done(null);
					return;
				}
			}
			else {
				for (var i = 0; i < res.children.length; i++) {
					var id = res.children[i].data.id;
					var post = res.children[i].data;

					if (!postMap[req.client.group]) {
						postMap[req.client.group] = {};
					}
					if (!postMap[req.client.group][id]) {
						postMap[req.client.group][id] = post;
						done(post);
						return;
					}
				}
				// TODO: Request more if we run out, check if at the end of the feed
				done(null);
				return;
			}
		});
	}

	return { getPost };
}();
