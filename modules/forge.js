var request = require('request');
var $ = require('cheerio').load();
var regex = require('../libs/regex');
var mongoose = require('mongoose');

var forgeVersionModel = mongoose.model('forgeversion');

exports.getForgeList = function(callback) {
    forgeVersionModel.findOne({
        id: 1
    }, 'index', function(err, doc) {
        if (err) {
            callback(err);
        } else {
            callback(null, doc.index);
        }
    });
};

exports.getLegacyList = function(callback) {
    forgeVersionModel.findOne({
        id: 1
    }, 'legacy', function(err, doc) {
        if (err) {
            callback(err);
        } else {
            callback(null, doc.legacy);
        }
    });
};