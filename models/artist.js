'use strict';
var mongoose = require('mongoose'),
    uuid = require('../lib/uuid'),
    Schema = mongoose.Schema,
    Artist = new Schema({

        uuid: {type: String, index: true, unique: true},
        access_token: {type: String},
        title: String,
        style: String,
        press_text: String,
        short_description: String,
        city_country: String,
        members: Number,
        members_vegan: Number,
        members_vegetarian: Number,
        notes: String,
        members_hostel: Number,
        members_external_host: Number,
        hostel_responsible: String,
        contact_info: String,
        created: Date,
        updated: Date

    }, {
        autoindex: process.env.NODE_ENV !== 'production',
        id: false
    });

if (typeof Artist.options.toJSON === 'undefined') {
    Artist.options.toJSON = {};
}

Artist.options.toJSON.transform = function (doc, ret) {
    filterParams(ret);
};

if (typeof Artist.options.toObject === 'undefined') {
    Artist.options.toObject = {};
}

Artist.options.toObject.transform = function (doc, ret) {
    filterParams(ret);
};

Artist.pre('save', function (next) {
    var now = Date.now();
    this.updated = now;
    if (!this.created) {
        this.created = now;
    }
    if (!this.uuid) {
        this.uuid = uuid.v4();
    }
    if (!this.access_token) {
        var secureRandom = require('secure-random');
        this.access_token = secureRandom.randomBuffer(16).toString('hex');
    }
    next();
});

function filterParams(obj) {
    delete obj.__v;
    delete obj._id;
}

module.exports.Artist = Artist;
