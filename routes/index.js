var express = require('express');
var router = express.Router();

/* GET  API. */
router.get('/', function (req, res, next) {
    res.status(200).json({ name: 'API Accommodation', version: '1.0.0' });
});

module.exports = router;