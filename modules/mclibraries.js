var request = require('request');
var mongoose = require('../conn.js');
var fs = require('fs');
var mpath = require('path');
var mcLibrariesPath = mpath.join(__dirname, '../public/mclibraries/');
var mcVersionPath = mpath.join(__dirname, '../public/mcversion/');
var util = require('../libs/util');
var MojangLibrariesUrl = 'http://libraries.minecraft.net/';
var mkdirp = require('mkdirp');
var mcversion = require('./mcversion');

var mcLibrariesSchema = new mongoose.Schema({
    name: String,
    reference: Number
});

var mcLibrariesModel = mongoose.model('mclibraries', mcLibrariesSchema);
var mcVersionModel = mongoose.model('mcversion');

exports.checkForUpdate = function(id) {
    fs.readFile(mcVersionPath + id + '/' + id + '.json', 'utf8', function(err, data) {
        data = JSON.parse(data);
        var libraries = data.libraries;
        for (var i in libraries) {
            var path = util.getLibPath(libraries[i]);
            util.exists(mcLibrariesPath + path, checkLibCallback(libraries[i].name, path));
        }
    });
};

exports.refresh = function() {
    mcVersionModel.findOne({
        id: 1
    }, 'index', function(err, doc) {
        if (err) {
            console.error('get Version faild:' + JSON.stringify(err));
        } else {
            var versionList = JSON.parse(doc.index).versions;
            console.log(versionList.length);
            for (var i in versionList) {
                console.log('check libraries  for ' + versionList[i].id);
                exports.checkForUpdate(versionList[i].id);
            }
        }
    });
};

var downloadLibCallback = function(name) {
    return function(err, res, body) {
        if (err) {
            console.error('download ' + id + 'error:' + JSON.stringify(err));
        } else {
            console.log(name + ' download finish');
            var mcLibrariesData = new mcLibrariesModel();
            mcLibrariesData.name = name;

        }
    };
};

var checkLibCallback = function(name, path) {
    return function(exist) {
        if (!exist) {
            console.log(name + " doesn't exist ready to download");
            mkdirp(mcLibrariesPath + mpath.dirname(path), function(err) {
                if (err) {
                    console.error('mkdir for ' + path + 'failed:' + JSON.stringify(err));
                } else {
                    request(MojangLibrariesUrl + path, downloadLibCallback(name)).pipe(fs.createWriteStream(mcLibrariesPath + path));
                }
            });
        }
    };
};