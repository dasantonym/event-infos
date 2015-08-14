'use strict';
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
    var selectAttributes = 'uuid title event_date access_token';
    mongoose.model('Event').find({})
        .select(selectAttributes)
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(data);
            }
        });
});

router.get('/:uuid', function (req, res, next) {
    mongoose.model('Event').findOne({uuid: req.params.uuid})
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(data);
            }
        });
});

router.post('/', function (req, res, next) {
    mongoose.model('Event').create(req.body, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

router.put('/:uuid', function (req, res, next) {
    mongoose.model('Event').findOneAndUpdate({uuid: req.params.uuid}, req.body, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

module.exports = router;