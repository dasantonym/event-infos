'use strict';
var express = require('express');
var router = express.Router();

router.get('/:partial', function (req, res, next) {
    res.render('partials/' + req.params.partial, {
        layout: false
    });
});

module.exports = router;