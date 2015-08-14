'use strict';
var mongoose = require('mongoose'),
    uuid = require('../lib/uuid'),
    Schema = mongoose.Schema,
    Event = new Schema({

        uuid: {type: String, index: true, unique: true},
        access_token: {type: String},
        location_uuid: {type: String},
        title: {type: String, required: true},
        description: String,
        announcement_text: String,
        type: String,
        event_date: {type: Date},
        event_time: {type: Date},
        event_end: Date,
        artist_uuids: [String],
        organiser: String,
        organiser_contact: String,
        technicians: [String],
        timetable: [{
            time: Date,
            description: String
        }],
        created: Date,
        updated: Date

    }, {
        autoindex: process.env.NODE_ENV !== 'production',
        id: false
    });

if (typeof Event.options.toJSON === 'undefined') {
    Event.options.toJSON = {};
}

Event.options.toJSON.transform = function (doc, ret) {
    filterParams(ret);
};

if (typeof Event.options.toObject === 'undefined') {
    Event.options.toObject = {};
}

Event.options.toObject.transform = function (doc, ret) {
    filterParams(ret);
};

Event.pre('save', function (next) {
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

module.exports.Event = Event;
