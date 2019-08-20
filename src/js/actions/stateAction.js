const path = require('path');
const action = require(path.join(__dirname, 'action'));

module.exports = function () {
    function run(req, cb) {
        var params = req.agent.params;
        if (req.client && req.client.state) {
            if (params.shakespeare) {
                req.client.state.shakespeare = !req.client.state.shakespeare;
                var message = req.client.state.shakespeare ? 'You have enabled Shakespeare mode' : 'Shakespeare mode disabled';
                action.sendMessage(message, req, cb);
            }
            if (params.owo) {
                req.client.state.owo = !req.client.state.owo;
                var message = req.client.state.owo ? 'You have enabled OwO mode' : 'OwO mode disabled';
                action.sendMessage(message, req, cb);
            }
        }
        else {
            action.sendMessage('Sorry I was unable to change my state', req, cb);
        }
    }

    return { run };
}();
