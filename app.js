#!/usr/bin/env node
console.log("before start")

const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
const redis = require(path.join(__dirname, 'src/js/util/redis'));
const file = require(path.join(__dirname, 'src/js/util/file'));
const cluster = require('cluster');
const homesteadBot = require(path.join(__dirname, 'src/js/bot'));
const config = file.read(path.join(__dirname, 'config/server.json'));
const port = process.env.PORT || config.port;
require("tls").DEFAULT_ECDH_CURVE = "auto"

console.log("starting")

if (cluster.isMaster) {
	console.log("Starting master");
	cluster.fork();
	cluster.on('exit', (worker) => {
		console.log('Worker ' + worker.id + ' died');
		cluster.fork();
	});
}
else {
	console.log("Starting child");
	var app = express();
	var server, options;

	app.use('/images', express.static(path.join(__dirname, 'src/static/images')));

	try {
		options = {
			key: file.read(path.join(__dirname, 'ssl/ssl.key')),
			cert: file.read(path.join(__dirname, 'ssl/ssl.crt')),
			ca: file.read (path.join(__dirname, 'ssl/ssl.ca-bundle'))
		};
		console.log("creating server")
		server = https.createServer(options, app);
	}
	catch(err) {
		console.log('Unable to use HTTPS, falling back to HTTP');
		server = http.createServer(app);
	}

	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	app.set('port', port);
	app.get('*', function(req, res, next) {
		console.log(req.url)
		!req.secure ? res.redirect('https://' + req.hostname + req.url) : next();
	});

	console.log("Starting Homestead Bot")
	homesteadBot.start();
}

function onError(error) {
	if (error.syscall !== 'listen') throw error;
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
		case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
		case 'ECONNRESET':
		console.error(bind + ' connection has been reset');
		process.exit(1);
		default:
		throw error;
	}
	console.error(error);
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

module.exports = app;
