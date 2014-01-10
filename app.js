/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var forge = require('./routes/forge');
var optifine = require('./routes/optifine');
var mcversion = require('./routes/mcversion');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/forge/versionlist', forge.forgelist);
app.get('/forge/legacylist', forge.legacylist);
app.get('/optifine/versionlist', optifine.versionList);
app.get('/optifine/:version', optifine.getOptifine);
app.get('/mcversion', mcversion.getList);
app.get('/mcversion/versions.json', mcversion.getList);
app.get('/mcversion/versions/versions.json', mcversion.getList);

http.createServer(app).listen(app.get('port'), function() {
    console.log('bmclapi server listening on port ' + app.get('port'));
});

forge.init();
optifine.init();
mcversion.init();