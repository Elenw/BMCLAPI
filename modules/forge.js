var request = require('request');
var $ = require('cheerio').load();
var regex = require('../libs/regex');
var mongoose = require('../conn.js');

var forgeVersionSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    index: String,
    legacy: String
});

var forgeVersionModel = mongoose.model('forgeversion', forgeVersionSchema);

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


exports.init = function() {
    getLegacyList();
    setInterval(getForgeList(), 24 * 60 * 60 * 1000);
    // setInterval(getLegacyList(), 24 * 60 * 60 * 1000);
};

var getForgeList = function() {
    console.log('start get forge list');
    var storage = [];
    request('http://files.minecraftforge.net', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            var htmlDom = $(body);
            var promo = htmlDom.find('#promotions_table');
            promo.find('tr').each(function(index) {
                var forgever = {};
                $(this).find('td').each(function(index) {
                    switch (index) {
                        case 0:
                            forgever.vername = $(this).text();
                            break;
                        case 1:
                            forgever.ver = $(this).text();
                            if (!forgever.vername) {
                                forgever.vername = forgever.ver;
                            }
                            break;
                        case 2:
                            forgever.mcver = $(this).text();
                            break;
                        case 3:
                            forgever.releasetime = $(this).text();
                            break;
                        case 4:
                            $(this).find('a').each(function(index) {
                                var text = $(this).text();
                                switch (text) {
                                    case 'Changelog':
                                        forgever.changelog = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'Installer':
                                        forgever.installer = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'Javadoc':
                                        forgever.javadoc = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'Src':
                                        forgever.src = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'Universal':
                                        forgever.universal = regex.getRealUrl($(this).attr('href'));
                                }
                            });
                            break;
                    }
                });
                if (!forgever.ver) return;
                storage.push(forgever);
            });
            var build = htmlDom.find('.builds');
            build.each(function(index) {
                var table = $(this).find('table');
                table.find('tr').each(function(index) {
                    var forgever = {};
                    $(this).find('td').each(function(index) {
                        switch (index) {
                            case 0:
                                forgever.ver = $(this).text();
                                break;
                            case 1:
                                forgever.mcver = $(this).text();
                                if (!forgever.vername) {
                                    forgever.vername = forgever.ver;
                                }
                                break;
                            case 2:
                                forgever.releasetime = $(this).text();
                                break;
                            case 3:
                                $(this).find('a').each(function(index) {
                                    var text = $(this).text();
                                    switch (text) {
                                        case 'Changelog':
                                            forgever.changelog = regex.getRealUrl($(this).attr('href'));
                                            break;
                                        case 'Installer':
                                            forgever.installer = regex.getRealUrl($(this).attr('href'));
                                            break;
                                        case 'Javadoc':
                                            forgever.javadoc = regex.getRealUrl($(this).attr('href'));
                                            break;
                                        case 'Src':
                                            forgever.src = regex.getRealUrl($(this).attr('href'));
                                            break;
                                        case 'Universal':
                                            forgever.universal = regex.getRealUrl($(this).attr('href'));
                                    }
                                });
                                break;
                        }
                    });
                    if (!forgever.ver) return;
                    storage.push(forgever);
                });
            });
            forgeVersionModel.findOneAndUpdate({
                id: 1
            }, {
                index: JSON.stringify(storage)
            }, function(err, doc) {
                if (err) {
                    console.log('save index list error:' + JSON.stringify(err));
                } else {
                    if (!doc) {
                        var forgeVersion = new forgeVersionModel();
                        forgeVersion.index = JSON.stringify(storage);
                        forgeVersion.save();
                    }
                    console.log('save index list success');
                }
            });
        }
    });
};

var getLegacyList = function() {
    console.log('start get forge legacy list');
    var storage = [];
    request('http://files.minecraftforge.net/minecraftforge/index_legacy.html', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            var htmlDom = $(body);
            var promo = htmlDom.find('#promotions_table');
            promo.find('tr').each(function(index) {
                var forgever = {};
                $(this).find('td').each(function(index) {
                    switch (index) {
                        case 0:
                            forgever.vername = $(this).text();
                            break;
                        case 1:
                            forgever.ver = $(this).text();
                            if (!forgever.vername) {
                                forgever.vername = forgever.ver;
                            }
                            break;
                        case 2:
                            forgever.mcver = $(this).text();
                            break;
                        case 3:
                            forgever.releasetime = $(this).text();
                            break;
                        case 4:
                            $(this).find('a').each(function(index) {
                                var text = $(this).text();
                                switch (text) {
                                    case 'changelog':
                                        forgever.changelog = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'installer':
                                        forgever.installer = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'javadoc':
                                        forgever.javadoc = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'src':
                                        forgever.src = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'universal':
                                        forgever.universal = regex.getRealUrl($(this).attr('href'));
                                }
                            });
                            break;
                    }
                });
                if (!forgever.ver) return;
                storage.push(forgever);
            });
            var build = htmlDom.find('#all_builds');
            var table = build.find('table');
            table.find('tr').each(function(index) {
                var forgever = {};
                $(this).find('td').each(function(index) {
                    switch (index) {
                        case 0:
                            forgever.ver = $(this).text();
                            break;
                        case 1:
                            forgever.mcver = $(this).text();
                            if (!forgever.vername) {
                                forgever.vername = forgever.ver;
                            }
                            break;
                        case 2:
                            forgever.releasetime = $(this).text();
                            break;
                        case 3:
                            $(this).find('a').each(function(index) {
                                var text = $(this).text();
                                switch (text) {
                                    case 'changelog':
                                        forgever.changelog = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'installer':
                                        forgever.installer = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'javadoc':
                                        forgever.javadoc = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'src':
                                        forgever.src = regex.getRealUrl($(this).attr('href'));
                                        break;
                                    case 'universal':
                                        forgever.universal = regex.getRealUrl($(this).attr('href'));
                                }
                            });
                            break;
                    }
                });
                if (!forgever.ver) return;
                storage.push(forgever);
            });
            forgeVersionModel.findOneAndUpdate({
                id: 1
            }, {
                legacy: JSON.stringify(storage)
            }, function(err, doc) {
                if (err) {
                    console.log('save legacy list error:' + JSON.stringify(err));
                } else {
                    if (!doc) {
                        var forgeVersion = new forgeVersionModel();
                        forgeVersion.legacy = JSON.stringify(storage);
                        forgeVersion.save();
                    }
                    console.log('save legacy list success');
                }
            });
        }
    });
};