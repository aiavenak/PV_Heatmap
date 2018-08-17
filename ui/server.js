// set up ======================================================================
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var path = require('path');
var methodOverride = require('method-override');
var port = process.env.PORT || 8081; 				// set the port	// load the database config
var staticify = require('staticify')(__dirname);

// configuration ===============================================================
app.use(staticify.middleware);

app.locals = {
    getVersionedPath: staticify.getVersionedPath
};

app.use('/public', express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.get('/favicon.ico', function(req, res) {  //return no content for favicon
    res.status(204);
});

app.set('view engine', 'pug');

// routes ======================================================================
require('./routes.js')(app);

// listen (start app with node server.js) ======================================
server.listen(port);

console.log("SCAffold UI listening on port " + port);