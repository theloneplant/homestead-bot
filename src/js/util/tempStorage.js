const path = require('path');
const redis = require(path.join(__dirname, 'redis'));

class Store {
    constructor(namespace) {
        redis.init(namespace);
    }
}
module.exports = Store;