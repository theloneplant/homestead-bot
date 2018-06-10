// const path = require('path');
// const redis = require('redis');
// const file = require(path.join(__dirname, '../util/file'));
// const config = file.read(path.join(__dirname, '../../../config/server.json'));

// module.exports = function() {
// 	var client = redis.createClient();
// 	client.hgetall('test', function(err, obj) {
// 		// obj is null when the key is missing
// 		console.log(err);
// 		console.log(obj);
// 		client.hmset('test', 'rand', [Math.random(), Math.random(), Math.random()]);
// 		client.expire('test', 1);
// 		console.log('in redis');
// 		client.hgetall('test', function(err, obj) {
// 			// obj is null when the key is missing
// 			console.log('A');
// 			console.log(obj);
// 		});
// 		setTimeout(()=>{
// 			client.hgetall('test', function(err, obj) {
// 				// obj is null when the key is missing
// 				console.log('B');
// 				console.log(obj);
// 			});
// 		}, 2000);
// 	});
// 	client.on('error', function (err) {
// 		console.log('Error ' + err);
// 	});

// 	return {  };
// }();

// class Redis {
// 	constructor(namespace, expire) {
// 		this.namespace = namespace;
// 		this.expire = expire * 60 * 60 * 24; // days
// 		this.store = {};
// 	}
//
// 	getActionEntry(name, req, cb) {
// 		if (config.dbEnabled) {
// 			var key = this.createActionKey(name);
// 			if (this.store[key]) {
// 				console.log('using cache to get');
// 				cb(null, this.store[key]);
// 			}
// 			console.log('getting from redis');
// 			client.hmget(this.namespace, (err, obj) => {
// 				if (err) {
// 					console.log(err);
// 					cb(err);
// 					return;
// 				}
// 				this.store[name] = obj;
// 				cb(null, obj);
// 				console.log(JSON,stringify(obj));
// 			});
// 		}
// 		else {
// 			cb('Database not enabled');
// 		}
// 	}
//
// 	setActionEntry(name, value, expire, req, cb) {
// 		if (config.dbEnabled) {
// 			var key = this.createActionKey(name);
// 			client.hmset(this.namespace, key, value, (err, obj) => {
// 				if (err) {
// 					console.log(err);
// 					cb(err);
// 					return;
// 				}
// 				console.log('successfully set ' + key);
// 				if (expire && parseInt(expire) > 0) {
// 					console.log('using expire');
// 					client.expire(this.namespace, parseInt(expire));
// 				}
// 				cb();
// 			});
// 		}
// 		else {
// 			cb('Database not enabled');
// 		}
// 	}
//
// 	createActionKey(name, req) {
// 		if (this.namespace && req && req.from && req.group
// 			&& req.type && req.channel && req.channel.type) {
// 			var key = req.group + ':' + req.type;
// 			if (req.channel.type === 'dm') {
// 				key += ':' + req.from;
// 			}
// 			key += ':' + this.namespace + '.' + name;
// 			console.log('key - ' + key);
// 			return key;
// 		}
// 		else {
// 			return null;
// 		}
// 	}
//
// 	checkHistory(posts, req, cb, i = 0) {
// 		if (posts && i < posts.length) {
// 			var id = posts[i].data.id;
// 			var post = posts[i].data;
// 			this.getActionEntry(id, req, (err, value) => {
// 				if (err) {
// 					console.log(err);
// 					cb(null);
// 					return;
// 				}
// 				if (value) {
// 					console.log('got value! ' + value);
//
// 				}
// 				else {
// 					console.log('no value found, saving to db');
// 					this.setActionEntry(id, post, this.expire, req, cb);
// 				}
// 			});
// 		}
// 		else {
// 			cb(null);
// 		}
// 	}
// }
//
// module.exports = Redis;
