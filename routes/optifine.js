var optifine = require('../modules/optifine');

exports.versionList = function(req, res) {
    optifine.getOptifineList(function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.type('json');
            res.send(result);
        }
    });
};

exports.init = function() {
    optifine.init();
};

exports.getOptifine = function(req, res) {
    var ver = req.params.version;
    if (!ver) {
        res.send(403, 'Access Denied');
    }
    ver = ver.replace(/[ ]/g, '_');
    optifine.getOptifine(ver, function(err, result) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(result);
        }
    });
};