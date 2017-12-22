const path = require('path');
const actionHub = require(path.join(__dirname, '../actions/actionHub'));
const apiaiAgent = require(path.join(__dirname, '../agents/apiaiAgent'));

module.exports = function() {
	function run(req, cb) {
		actionHub.run(req, cb);
	}

	function interpret(req, cb) {
		if (!req.to) {
			// Figure out if it was sent to you
			cb(); // Skip request
		}
		else {
			mapInterpret(req, cb);
		}
	}

	function mapInterpret(req, cb) {
		apiaiAgent.interpret(req, cb);
	}

	return { run, interpret };
}();
