const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const math = require(path.join(__dirname, '../util/math'));
const action = require(path.join(__dirname, 'action'));

module.exports = function () {
    function run(req, cb) {
        var rand = Math.random();
        if (rand > 0.5) {
            action.sendMessage("Heads", req, cb);
        }
        else {
            action.sendMessage("Tails", req, cb);
        }
    }

    return { run };
}();
