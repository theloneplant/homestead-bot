const fs = require('fs');

module.exports = function() {
	function read(path) {
		var pathArray = path.split('.');
		var extension = pathArray[pathArray.length - 1];
		var rawData = fs.readFileSync(path);
		if (extension === 'json') {
			return JSON.parse(rawData);
		}
		else {
			return rawData;
		}
	}

	return { read };
}();
