var optifine = require('../modules/optifine');

exports.versionList = function(req, res){
    optifine.getOptifineList(function(err, result){
        if (err){
            res.send(err);
        } else {
            res.type('json');
            res.send(result);
        }
    });
};

exports.init = function(){
    optifine.init();
};