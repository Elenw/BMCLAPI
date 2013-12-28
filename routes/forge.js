var forge = require('../modules/forge');

exports.forgelist = function(req, res){
    forge.getForgeList(function(err, result){
        if (err){
            return res.send(err);
        } else {
            res.send(result);
        }
    });
};