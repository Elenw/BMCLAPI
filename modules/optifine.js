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

var getOptifineList = function(callback) {
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
                $(this).find('tr').each(function(index) {
                    optifineVer = {};
                    var versionDom = $(this);
                    optifineVer.ver = versionDom.find('.downloadLineFile').text();
                    optifineVer.dl = versionDom.find('.downloadLineDownload a').attr('href');
                    optifineVer.mirror = versionDom.find('.downloadLineMirror a').attr('href');
                    optifineVer.date = versionDom.find('.downloadLineDate').text();
                    (function() {
                        request('http://optifine.net/' + optifineVer.mirror, {
                            method: 'GET'
                        }, function(err, res, body) {
                            if (err) {
                                console.log(err);
                            } else {
                                var dlpageDom = $(body);
                                optifineVer.url = 'http://optifine.net/' + dlpageDom.find('#Download a').attr('href');
                                storage.push(optifineVer);
                                console.log('optifine' + aindex + '/' + dllDom.length);
                                if (aindex == dllDom.length - 1) {
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
                            }
                        });
                    })(optifineVer);
                });
            });
        }
    });
};