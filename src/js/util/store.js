const path = require('path');
const redis = require(path.join(__dirname, 'redis'));

/**
 * Class meant for storing objects permanently or with expirations
 * inside of a database. This isn't meant to store large amounts
 * of data. It'll take double the memory since it stores a cache
 * of these values in addition to whatever the Redis database
 * stores in memory. This allows modifying this object to happen
 * synchronously without resorting to async calls and potentially
 * having to load keys from disk. It's a bit wasteful but makes
 * development much easier since all potential disk accesses happen
 * on save() and load()
 */
class Store {
    constructor(name, group) {
        this.namespace = (group && typeof group === 'string') ? name + '.' + group : name;
        this.map = {};
        redis.init(this.namespace);
    }

    set(name, key, value, ttl) {
        var entry = { 'value': value };
        if (ttl) {
            if (ttl < 0) return;
            entry.expire = Date.now() + ttl;
        }
        if (!this.map[name]) {
            this.map[name] = {};
        }
        this.map[name][key] = entry;
    }

    get(name, key) {
        var entry = this.map && this.map[name] && this.map[name][key];
        if (!entry) return undefined;
        if (entry.expire && Date.now() - entry.expire > 0) {
            delete this.map[name][key];
            return undefined;
        }
        return entry.value;
    }

    save(name, cb) {
        this.clearExpiredKeys(name);
        redis.setJson(this.namespace, name, this.map[name], (err) => {
            if (err) {
                console.log('Error saving ' + this.namespace + '.' + name + ' to Redis: ' + err);
            }
            if (cb) cb(err);
        });
    }

    load(name, cb) {
        // TODO: Load all
        redis.getJson(this.namespace, name, (err, obj) => {
            this.map[name] = typeof obj === "object" ? obj : {};
            this.clearExpiredKeys(name);
            if (err) {
                console.log('Error loading ' + this.namespace + '.' + name + ' from Redis: ' + err);
            }
            if (cb) cb(err);
        });
    }

    clearExpiredKeys(name) {
        for (var key in this.map[name]) {
            if (this.map[name][key].expire && Date.now() - this.map[name][key].expire > 0) {
                delete this.map[name][key];
            }
        }
    }
}
module.exports = Store;