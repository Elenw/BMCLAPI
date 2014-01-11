var mclibraries = require('../modules/mclibraries');

exports.refresh = function(res, req) {
    mclibraries.refresh();
    req.send('OK');
};