'use strict';
var mongoose = require('mongoose'),
    uuid = require('../lib/uuid'),
    Schema = mongoose.Schema,
    Asset = new Schema({

        uuid: {type: String, index: true, unique: true},
        parent_uuid: {type: String, index: true, required: true},
        original_filename: {type: String, required: true},
        mime_type: {type: String, required: true},
        size: {type: Number, required: true},
        category: String,
        created: Date,
        updated: Date

    }, {
        autoindex: process.env.NODE_ENV !== 'production',
        id: false
    });

if (typeof Asset.options.toJSON === 'undefined') {
    Asset.options.toJSON = {};
}

Asset.options.toJSON.transform = function (doc, ret) {
    filterParams(ret);
};

if (typeof Asset.options.toObject === 'undefined') {
    Asset.options.toObject = {};
}

Asset.options.toObject.transform = function (doc, ret) {
    filterParams(ret);
};

Asset.pre('save', function (next) {
    var now = Date.now();
    this.updated = now;
    if (!this.created) {
        this.created = now;
    }
    if (!this.uuid) {
        this.uuid = uuid.v4();
    }
    next();
});

function filterParams(obj) {
    delete obj.__v;
    delete obj._id;
}

module.exports.Asset = Asset;
