var request = require('request');
var $ = require('cheerio').load();
var regex = require('../libs/regex')

exports.getForgeList = function(callback) {
    var storage = [];
    request('http://files.minecraftforge.net', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            callback(err);
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
            });
            callback(null, storage);
        }
    });
};

exports.getLegacyList = function(callback) {
    var storage = [];
    request('http://files.minecraftforge.net/minecraftforge/index_legacy.html', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            callback(err);
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
            });
            callback(null, storage);
        }
    });
}