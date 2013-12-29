exports.getRealUrl = function(adfly){
    var urlRex = /http:\/\/adf\.ly\/.*\/(http.*)/g;
    var result = urlRex.exec(adfly);
    if (!!result){
        return result;
    } else {
        return adfly;
    }
};