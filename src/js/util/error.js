const path = require('path');
const math = require(path.join(__dirname, 'math'));

class Error {
	constructor(strings) {
		this.errorMessages = strings;
	}

	randomError() {
		return this.errorMessages[math.randomInt(0, this.errorMessages.length - 1)];
	}
}

module.exports = Error;
