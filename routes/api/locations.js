'use strict';
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
    mongoose.model('Location').find()
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(data);
            }
        });
});

router.get('/:uuid', function (req, res, next) {
    mongoose.model('Location').findOne({uuid: req.params.uuid})
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(data);
            }
        });
});

router.get('/:uuid/events', function (req, res, next) {
    mongoose.model('Event').find({location_uuid: req.params.uuid})
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(data);
            }
        });
});

router.post('/', function (req, res, next) {
    mongoose.model('Location').create(req.body, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

router.put('/:uuid', function (req, res, next) {
    mongoose.model('Location').findOneAndUpdate({uuid: req.params.uuid}, req.body, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

module.exports = router;
