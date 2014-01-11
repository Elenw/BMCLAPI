var fs = require('fs');

exports.nullCallback = function() {};

exports.errCallback = function(err) {
    if (err) {
        return console.error(err);
    }
};

exports.rmdirrf = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                exports.rmdirrf(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.getLibPath = function(lib) {
    var split = lib.name.split(':');
    if (split.length != 3) {
        return false;
    }
    var libp = split[0].replace(/\./g, '/');
    libp += '/';
    libp += split[1];
    libp += '/';
    libp += split[2];
    libp += '/';
    libp += split[1];
    libp += '-';
    libp += split[2];
    libp += '.jar';
    return libp;
};

exports.exists = function(path, callback) {
    fs.stat(path, function(err, stat) {
        if (err) {
            callback(false);
        } else {
            if (stat.size !== 0) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
};