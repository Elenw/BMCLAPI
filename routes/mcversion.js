var mcversion = require('../modules/mcversion');

exports.getList = function(req, res) {
    mcversion.getList(function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.type('json');
            res.send(result);
        }
    });
};

exports.init = function() {
    mcversion.init();
};

exports.refresh = function(req, res) {
    mcversion.refresh();
    res.send('Working');
};