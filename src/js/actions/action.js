module.exports = function() {
	function sendResponse(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	return { sendResponse };
}();
