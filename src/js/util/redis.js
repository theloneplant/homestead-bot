const path = require('path');
const redis = require('redis');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

module.exports = function() {
    var client = redis.createClient();
    var namespaces = {
        'users': true
    };

	client.on('error', function (err) {
		console.log('Redis error: ' + err);
	});

    function init(namespace) {
        if (namespaces[namespace]) {
            throw new Error('Failed to initialize Redis namespace, ' + namespace + ' already exists as a namespace');
        }
        namespaces[namespace] = true;
    }

    function getJson(namespace, field, cb) {
        var namespace = concatKey(namespace);
        if (!namespaces[namespace]) {
            init(namespace);
        }
        client.hget(namespace, field, (err, objStr) => {
            if (err) {
                if (cb) cb(err);
                return;
            }
            var obj = objStr;
            var error = undefined;
            try {
                obj = JSON.parse(objStr);
            }
            catch(e) {
                error = new Error('Error parsing Redis object, returning string value: ' + objStr + '\n' + e);
                console.log(error);
            }
            if (cb) cb(error, obj);
        });
    }

    function setJson(namespace, field, value, cb) {
        if (!namespaces[namespace]) {
            init(namespace);
        }
        client.hset(namespace, field, JSON.stringify(value), cb);
    }

    function getUser(platform, userID, cb) {
        getJson('users', concatKey(platform, userID), cb);
    }

    function setUser(platform, userID, value, cb) {
        // TODO: Validate user object
        setJson('users', concatKey(platform, userID), value, cb);
    }

    function concatKey() {
        return Array.from(arguments).join('.');
    }

    return { init, getJson, setJson, getUser, setUser };
}();