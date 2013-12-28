var request = require('request');
var $ = require('cheerio').load();

exports.getForgeList = function(callback) {
    request('http://files.minecraftforge.net', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            callback(err);
        } else {
            var htmlDom = $(body);
            var promo = htmlDom.find('#promotions_table');
            var storage = [];
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
                        }
                    });
                }
                storage.push(forgever);
                console.log(forgever);
            });
            callback(null, storage);
        }
    });
};