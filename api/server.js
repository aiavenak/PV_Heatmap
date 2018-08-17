#!/usr/bin/node

//contrib
var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var expressWinston = require('express-winston');

//mine
var config = require('./config');
var logger = new winston.Logger(config.logger.winston);
var db = require('./models');

//init express
var app = express();
app.use(bodyParser.json()); //parse application/json
app.use(expressWinston.logger(config.logger.winston));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', require('./controllers'));
app.get('/health', function(req, res) {
    res.json({status: 'ok'});
});

//error handling
app.use(expressWinston.errorLogger(config.logger.winston)); 
app.use(function(err, req, res, next) {
    logger.error(err);
    logger.error(err.stack);
    res.status(err.status || 500);
    res.json({message: err.message, /*stack: err.stack*/}); //let's hide callstack for now
});
process.on('uncaughtException', function (err) {
    //TODO report this to somewhere!
    logger.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    logger.error(err.stack)
    //process.exit(1); //some people think we should do this.. but I am not so sure..
})

exports.app = app;
exports.start = function(cb) {
    var port = process.env.PORT || config.express.port || '8080';
    var host = process.env.HOST || config.express.host || 'localhost';
    db.init(function(err) {
        if(err) return cb(err);
        app.listen(port, host, function(err) {
            if(err) return cb(err);
            logger.info("SCAffold API service running on %s:%d in %s mode", host, port, app.settings.env);
            cb(null);
        });
    });
}

