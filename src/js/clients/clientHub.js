const path = require('path');
const Ajv = require('ajv');
const agentHub = require(path.join(__dirname, '../agents/agentHub'));
const processSchema = require(path.join(__dirname, '../../json/clients/processSchema.json'));

module.exports = function() {
	const ajv = new Ajv();

	function process(req, cb) {
		agentHub.interpret(req, cb);
	}

	return { process };
}();
