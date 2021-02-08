const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const action = require(path.join(__dirname, 'action'));
const Error = require(path.join(__dirname, '../util/error'));

module.exports = function () {
    var error = new Error([
        'Sorry that functionality isn\'t supported yet.'
    ]);

    function run(req, cb) {
        var mediaControl = req.agent.params.mediaControl;
        if (mediaControl === 'play' || mediaControl === 'stop' || mediaControl === 'pause'
            || mediaControl === 'next' || mediaControl === 'previous' || mediaControl === 'playing') {
            console.log('media control: ' + mediaControl)
            action.sendInfo({ 'mediaControl': mediaControl }, req, cb);
        }
        else {
            console.log('Unsupported media control');
            action.sendMessage(error.randomError(), req, cb);
        }
    }

    return { run };
}();
