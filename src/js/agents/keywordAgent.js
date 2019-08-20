const path = require('path');
const math = require(path.join(__dirname, '../util/math'));
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function () {
    function interpret(req, done) {
        var keywordConfig = config.groups[req.client.group].agents.keyword;
        for (var key in keywordConfig) {
            if (req && typeof req.message === "string" && req.message.includes(key)) {
                var rand = math.randomInt(0, keywordConfig[key].length);
                console.log(key)
                console.log(rand)
                console.log(keywordConfig[key][rand])
                req.agent = {
                    'action': 'SendMessage',
                    'params': {
                        'message': keywordConfig[key][rand],
                        'private': false
                    }
                };
                done(true, req);                
                return;
            }
        }
        done(false);
    }

    return { interpret }
}();
