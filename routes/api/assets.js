'use strict';
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs-extra');
var router = express.Router();

Promise.promisifyAll(fs);

router.get('/list/:parent_uuid', function (req, res, next) {
    mongoose.model('Asset').find({parent_uuid: req.params.parent_uuid})
        .exec(function (err, event) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send(event);
            }
        });
});

router.get('/:uuid', function (req, res, next) {
    mongoose.model('Asset').findOne({uuid: req.params.uuid})
        .exec(function (err, event) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send(event);
            }
        });
});

router.get('/download/:uuid', function (req, res, next) {
    mongoose.model('Asset').findOne({uuid: req.params.uuid})
        .exec(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                if (!data) {
                    res.status(404).send();
                    return;
                }
                res.setHeader('Content-disposition', 'attachment; filename=' + (data.original_filename || 'untitled'));
                res.setHeader('Content-type', data.mimetype || 'application/octet-stream');
                var filestream = fs.createReadStream(path.resolve('./assets/' + data.uuid));
                filestream.pipe(res);
            }
        });
});

router.post('/', function (req, res, next) {
    var fields = {};
    var files = [];
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var filedata = {
            tmpid: Math.round(Math.random() * 100000000000).toString(), // TODO: secure random maybe
            file: file,
            fieldname: fieldname,
            filename: filename,
            encoding: encoding,
            mimetype: mimetype
        };
        files.push(filedata);
        file.pipe(fs.createWriteStream(path.resolve('./tmp/' + filedata.tmpid)));
    });
    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        if (!fieldnameTruncated && !valTruncated) {
            fields[fieldname] = val;
        }
    });
    req.busboy.on('finish', function () {
        if (files.length === 0) {
            res.status(400).send();
            return;
        }
        Promise.map(files, function (f) {
            var asset = fields;
            asset.mime_type = f.mimetype;
            asset.original_filename = f.filename;
            return mongoose.model('Asset').create(asset)
                .then(function (data) {
                    return fs.renameAsync(path.resolve('./tmp/' + f.tmpid), path.resolve('./assets/' + data.uuid))
                        .then(function () {
                            res.setHeader('Content-Type', 'text/html');
                            res.status(200).send(JSON.stringify(data));
                        });
                });
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    });
    req.pipe(req.busboy);
});

module.exports = router;
