#!/usr/bin/env node
const https = require('https');
const express = require('express');
const path = require('path');
const file = require(path.join(__dirname, 'src/js/util/file'));
const homesteadBot = require(path.join(__dirname, 'src/js/bot'));
const config = file.read(path.join(__dirname, 'config/server.json'));
const port = process.env.PORT || config.port;

homesteadBot.start();

const options = {
	key: file.read(path.join(__dirname, 'ssl/ssl.key')),
	cert: file.read(path.join(__dirname, 'ssl/ssl.crt')),
	ca: file.read (path.join(__dirname, 'ssl/ssl.ca-bundle'))
};

var app = express();
var server = https.createServer(options, app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.set('port', port);

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
		default:
		throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

module.exports = app;
