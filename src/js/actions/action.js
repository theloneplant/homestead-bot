module.exports = function() {
	var features = {
		'discord': {
			'embed': true
		}
	};

	function sendMessage(text, req, cb, params = {}, updateCB) {
		req.action = {
			'text': text,
			'targetUser': params.targetUser,
			'temp': params.temp,
			'embed': params.embed,
			'code': params.code,
			'statusText': params.statusText,
			'emotes': params.emotes
		};
		cb(null, req, updateCB);
	}

	function sendDM(text, req, cb, params = {}, updateCB) {
		req.action = {
			'text': text,
			'private': true,
			'temp': params.temp,
			'embed': params.embed,
			'code': params.code,
			'statusText': params.statusText,
			'emotes': params.emotes
		};
		cb(null, req, updateCB);
	}

	function sendInfo(info, req, cb, updateCB) {
		req.action = info;
		cb(null, req, updateCB);
	}

	function getTextFeatures(type) {
		return features[type];
	}

	return { sendMessage, sendDM, sendInfo, getTextFeatures };
}();
