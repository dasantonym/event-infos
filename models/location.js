'use strict';
var mongoose = require('mongoose'),
    uuid = require('../lib/uuid'),
    Schema = mongoose.Schema,
    Location = new Schema({

        uuid: {type: String, index: true, unique: true},
        title: {type: String, required: true},
        created: Date,
        updated: Date

    }, {
        autoindex: process.env.NODE_ENV !== 'production',
        id: false
    });

if (typeof Location.options.toJSON === 'undefined') {
    Location.options.toJSON = {};
}

Location.options.toJSON.transform = function (doc, ret) {
    filterParams(ret);
};

if (typeof Location.options.toObject === 'undefined') {
    Location.options.toObject = {};
}

Location.options.toObject.transform = function (doc, ret) {
    filterParams(ret);
};

Location.pre('save', function (next) {
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

module.exports.Location = Location;
