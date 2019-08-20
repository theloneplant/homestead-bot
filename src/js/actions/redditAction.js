const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const reddit = require(path.join(__dirname, '../util/reddit'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function () {
    function run(req, cb) {
        // TODO: Error handling
        var subreddit = req.agent.params.subreddit;
        var time = req.agent.params.time;
        reddit.getPost(subreddit, req, (post) => {
            console.log(JSON.stringify(post));
            action.sendMessage(post.selftext, req, cb);
        }, time);
    }

    return { run };
}();
