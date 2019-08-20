const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const math = require(path.join(__dirname, '../util/math'));
const action = require(path.join(__dirname, 'action'));
const bobRoss = file.read(path.join(__dirname, '../../../config/bobRoss.json'));

module.exports = function () {
    function run(req, cb) {
        var episodes = bobRoss.episodes;
        var rand = math.randomInt(0, episodes.length);
        action.sendMessage(episodes[rand].title + "\n" + episodes[rand].url, req, cb);
    }

    return { run };
}();
