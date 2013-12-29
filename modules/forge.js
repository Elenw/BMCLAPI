var request = require('request');
var $ = require('cheerio').load();

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
                if (index > 0) {
                    console.log(index);
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
                                            forgever.changelog = $(this).attr('href');
                                            break;
                                        case 'Installer':
                                            forgever.installer = $(this).attr('href');
                                            break;
                                        case 'Javadoc':
                                            forgever.javadoc = $(this).attr('href');
                                            break;
                                        case 'Src':
                                            forgever.src = $(this).attr('href');
                                            break;
                                        case 'Universal':
                                            forgever.universal = $(this).attr('href');
                                    }
                                });
                                break;
                        }
                    });
                    storage.push(forgever);
                }

                var build = htmlDom.find('.builds');
                build.each(function(index) {
                    var table = $(this).find('table');
                    table.find('tr').each(function(index) {
                        if (index > 0) {
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
                                                    forgever.changelog = $(this).attr('href');
                                                    break;
                                                case 'Installer':
                                                    forgever.installer = $(this).attr('href');
                                                    break;
                                                case 'Javadoc':
                                                    forgever.javadoc = $(this).attr('href');
                                                    break;
                                                case 'Src':
                                                    forgever.src = $(this).attr('href');
                                                    break;
                                                case 'Universal':
                                                    forgever.universal = $(this).attr('href');
                                            }
                                        });
                                        break;
                                }
                            });
                            storage.push(forgever);
                        }
                    });
                });
            });
            callback(null, storage);
        }
    });
};