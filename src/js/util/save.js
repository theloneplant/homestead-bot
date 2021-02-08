const path = require('path');
const redis = require(path.join(__dirname, 'redis'));

class Save {
    constructor(namespace) {
        redis.init(namespace);
    }
}
module.exports = Save;