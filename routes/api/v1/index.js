var express = require('express');
var router = express.Router();

router.use('/bot/', require('./bot'));

module.exports = router;
