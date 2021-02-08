var express = require('express');
var path = require('path');
var router = express.Router();
const { exec } = require('child_process');

router.post('/dialogflow', (req, res) => {
	res.send({
		err: null,
		res: {
			message: "Hello World"
		}
	});
});

module.exports = router;
