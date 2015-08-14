'use strict';
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
    var selectAttributes = 'uuid title';
    mongoose.model('Artist').find({})
        .select(selectAttributes)
        .exec(function (err, events) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(events);
            }
        });
});

router.get('/:uuid', function (req, res, next) {
    var event_uuid = req.params.uuid;
    mongoose.model('Artist').findOne({uuid: event_uuid})
        .exec(function (err, event) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(event);
            }
        });
});

router.post('/', function (req, res, next) {
    mongoose.model('Artist').create(req.body, function (err, event) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.status(200).send(event);
        }
    });
});

router.put('/:uuid', function (req, res, next) {
    mongoose.model('Artist').findOneAndUpdate({uuid: req.params.uuid}, req.body, function (err, event) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(event);
        }
    });
});

module.exports = router;
