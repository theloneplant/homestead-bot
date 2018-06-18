const path = require('path');
const rawjs = require('raw.js');
const Store = require(path.join(__dirname, 'store'));
const file = require(path.join(__dirname, '../util/file'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function() {
	var login = {
		'username': credentials.actions.reddit.username,
		'password': credentials.actions.reddit.password
	}
	var posts = 'posts';
	var reddit = new rawjs(credentials.actions.reddit.userAgent);
	var store = new Store('reddit');
	var ready = false;
	store.load(posts, () => {
		ready = true;
		reddit.setupOAuth2(credentials.actions.reddit.clientId, credentials.actions.reddit.clientSecret);
		reddit.auth(login, (err, res) => {
			if (err) {
				console.log("Unable to authenticate user: " + err);
			}
		});
	});

	function getPost(subreddit, req, cb, age = 'day', retry = 5) {
		if (!ready) {
			cb(undefined)
			return;
		}
		reddit.top({r: subreddit, t: age}, (err, res) => {
			if (err) {
				if (retry > 0) {
					getPost(subreddit, cb, age, --retry);
				}
				else {
					cb(undefined);
					return;
				}
			}
			else {
				for (var i = 0; i < res.children.length; i++) {
					var id = res.children[i].data.id;
					var post = res.children[i].data;

					var groupPosts = store.get(posts, req.client.group);
					if (!groupPosts) {
						groupPosts = {};
					}
					if (!groupPosts[id]) {
						groupPosts[id] = post;
						store.set(posts, req.client.group, groupPosts, 1000 * 60 * 60 * 24);
						store.save(posts);
						cb(post);
						return;
					}
				}
				// TODO: Request more if we run out, check if at the end of the feed
				cb(undefined);
				return;
			}
		});
	}

	return { getPost };
}();
