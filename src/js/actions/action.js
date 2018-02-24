module.exports = function() {
	function sendMessage(str, req, cb, ttl) {
		req.action = {
			'result': str,
			'ttl': ttl
		};
		cb(req);
	}

	function sendDM(str, req, cb, ttl) {
		req.action = {
			'result': str,
			'private': true,
			'ttl': ttl
		};
		cb(req);
	}

	function sendInfo(info, req, cb) {
		req.action = info;
		cb(req);
	}

	return { sendMessage, sendDM, sendInfo };
}();
