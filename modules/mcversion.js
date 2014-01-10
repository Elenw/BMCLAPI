var request = require('request');
var mongoose = require('../conn.js');
var fs = require('fs');
var path = require('path');
var mcVersionPath = path.join(__dirname, '../public/mcversion/');
var util = require('../libs/util');

var mcVersionSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    index: String
});

var mcVersionModel = mongoose.model('mcversion', mcVersionSchema);

exports.getList = function(callback) {
    mcVersionModel.findOne({
        id: 1
    }, 'index', function(err, doc) {
        if (err) {
            return callback(err);
        } else {
            return callback(doc.index);
        }
    });
};

exports.init = function() {
    getVersionList();
    setInterval(getVersionList, 24 * 60 * 60 * 1000);
};

var getVersionList = function() {
    console.log('start get mc version');
    request('https://s3.amazonaws.com/Minecraft.Download/versions/versions.json', {
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            return console.error('get mc version error ' + JSON.stringify(err));
        } else {
            mcVersionModel.findOneAndUpdate({
                id: 1
            }, {
                index: body
            }, function(err, doc) {
                if (err) {
                    return console.error('save mc version to mongodb error ' + JSON.stringify(err));
                } else {
                    if (!doc) {
                        var mcVersion = new mcVersionModel();
                        mcVersion.index = body;
                        mcVersion.save();
                    }
                    console.log('save mc version success');
                }
            });
            console.log('checking for mc version file');
            var mcVersionList = JSON.parse(body).versions;

            var fsreaddirCallback = function(id) {
                return function(exists) {
                    if (!exists) {
                        console.log(id + " doesn't exist downloading");
                        fs.mkdir(mcVersionPath + id, 0777, function(err) {
                            if (err) {
                                console.error('create ' + id + 'dir error :' + JSON.stringify(err));
                            } else {
                                request('https://s3.amazonaws.com/Minecraft.Download/versions/' + id + '/' + id + '.json', function(err, res, body) {
                                    if (err) {
                                        console.error('download ' + id + 'error:' + JSON.stringify(err));
                                    } else {
                                        console.log(id + ' json download finish');
                                    }
                                }).pipe(fs.createWriteStream(mcVersionPath + id + '/' + id + '.json'));
                                request('https://s3.amazonaws.com/Minecraft.Download/versions/' + id + '/' + id + '.jar', function(err, res, body) {
                                    if (err) {
                                        console.error('download ' + id + 'error:' + JSON.stringify(err));
                                    } else {
                                        console.log(id + ' jar download finish');
                                    }
                                }).pipe(fs.createWriteStream(mcVersionPath + id + '/' + id + '.jar'));
                            }
                        });

                    }
                };
            };

            for (var i in mcVersionList) {
                var id = mcVersionList[i].id;
                fs.exists(mcVersionPath + id, fsreaddirCallback(id));
            }
            fs.readdir(mcVersionPath, function(err, files) {
                if (err) {
                    console.error('read mcversion dir error:' + JSON.stringify(err));
                } else {
                    for (var i in files) {
                        var flag = true;
                        for (var j in mcVersionList) {
                            if (mcVersionList[j].id == files[i]) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            util.rmdirrf(mcVersionPath + files[i]);
                            console.log(files[i] + ' had remove by mojang ,deleteing');
                        }
                    }
                }
            });
        }
    });
};