module.exports = function() {
	function sendResponse(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	function sendStream(url, req, cb) {
		req.action = {
			'stream': url
		};
		cb(req);
	}

	return { sendResponse, sendStream };
}();
