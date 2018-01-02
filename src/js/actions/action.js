module.exports = function() {
	function sendMessage(str, req, cb) {
		req.action = {
			'result': str
		};
		cb(req);
	}

	function sendInfo(info, req, cb) {
		req.action = info;
		cb(req);
	}

	return { sendMessage, sendInfo };
}();
