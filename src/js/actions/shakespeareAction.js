const path = require('path');
const cleverbotnode = require('cleverbot-node');
const file = require(path.join(__dirname, '../util/file'));
const shakespeare = require(path.join(__dirname, '../util/shakespeare'));
const action = require(path.join(__dirname, 'action'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));
const credentials = file.read(path.join(__dirname, '../../../config/credentials.json'));

module.exports = function () {
    const cbot = new cleverbotnode();
    cbot.configure({
        botapi: credentials.actions.cleverbot.token
    });

    function run(req, cb) {
        cbot.write(req.message, (response) => {
            if (response && response.output) {
                var translated = shakespeare.translate(response.output);
                action.sendMessage(translated, req, cb);
            } else {
                console.log('Cleverbot failed to receive message');
                action.sendMessage('I\'m dumb anon, talketh to me lat \'r', req, cb);
            }
        });
    }

    return {
        run
    };
}();
