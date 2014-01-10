var request = require('request');
var $ = require('cheerio').load();
var regex = require('../libs/regex');
var mongoose = require('../conn.js');

var optifineVersionSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    index: String
});

var optifineVersionModel = mongoose.model('optifineversion', optifineVersionSchema);

exports.getOptifineList = function(callback) {
    optifineVersionModel.findOne({
        id: 1
    }, 'index', function(err, doc) {
        if (err) {
            callback(err);
        } else {
            callback(null, doc.index);
        }
    });
};

exports.init = function() {
    setInterval(getOptifineList(), 24 * 60 * 60 * 1000);
};

exports.getOptifine = function(ver, callback) {
    request('http://optifine.net/adloadx.php?f=' + ver + '.jar', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            callback(err);
        } else {
            var dlpageDom = $(body);
            callback(null, 'http://optifine.net/' + dlpageDom.find('#Download a').attr('href'));
        }
    });
};

var getOptifineList = function() {
    console.log('start get optifine list');
    request('http://optifine.net/downloads.php', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            var htmlDom = $(body);
            var storage = [];
            var dllDom = htmlDom.find('.downloadLine');
            dllDom.each(function(aindex) {
                var trDom = $(this).find('tr');
                trDom.each(function(index) {
                    optifineVer = {};
                    var versionDom = $(this);
                    optifineVer.ver = versionDom.find('.downloadLineFile').text();
                    optifineVer.dl = versionDom.find('.downloadLineDownload a').attr('href');
                    optifineVer.mirror = 'http://optifine.net/' + versionDom.find('.downloadLineMirror a').attr('href');
                    optifineVer.date = versionDom.find('.downloadLineDate').text();
                    storage.push(optifineVer);
                    if (aindex == dllDom.length - 1 && index == trDom.length - 1) {
                        optifineVersionModel.findOneAndUpdate({
                            id: 1
                        }, {
                            index: JSON.stringify(storage)
                        }, function(err, doc) {
                            if (err) {
                                console.log('save optifine list error:' + JSON.stringify(err));
                            } else {
                                if (!doc) {
                                    var optifineVersion = new optifineVersionModel();
                                    optifineVersion.index = JSON.stringify(storage);
                                    optifineVersion.save();
                                }
                                console.log('save optifine list success');
                            }
                        });
                    }
                });
            });
        }
    });
};