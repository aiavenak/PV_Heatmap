'use strict';

//node
var fs = require('fs');
var path = require('path');

//contrib
var express = require('express');
var winston = require('winston');
const jsonwt = require('jsonwebtoken');
var request = require('request');
var ejs = require('ejs');

//mine
var config = require('./config');
var logger = new winston.Logger(config.logger.winston);
var db = require('./models');

var router = express.Router();

///////////////JSON WEB TOKEN//////////////
///////////////////////////////////////////

function issue_jwt(user, cb) {
    console.log("issuing!");
    var claim = {
        iss: config.auth.iss,
        exp: (Date.now() + config.auth.ttl)/1000,
        profile: {
            username: user
        }
    };
    console.log( jsonwt.sign(claim, config.auth.secret));
    cb(null, jsonwt.sign(claim, config.auth.secret));
}

function check_jwt(req, res, next) {
    if(req.query.jwt === undefined) {
        res.sendStatus("403"); //FORBIDDEN
        return;
    }

    var decoded = jsonwt.verify(req.query.jwt, config.auth.secret);

    if(decoded === undefined){
        res.sendStatus("403"); //FORBIDDEN
        return;
    } else {
        next();
    }
}

///////////////IU CAS//////////////////////
///////////////////////////////////////////

router.get('/verify', function(req, res, next) {
    var ticket = req.query.casticket;

    if(!req.headers.referer) return next("Referer not set in header..");
    var casurl = req.headers.referer;
    request({
        url: 'https://cas.iu.edu/cas/validate?cassvc=IU&casticket='+ticket+'&casurl='+casurl,
        timeout: 1000*5, //long enough?
    }, function (err, response, body) {
        if(err) return next(err);
        logger.debug("verify responded", response.statusCode, body);
        if (response.statusCode == 200) {
            var reslines = body.split("\n");
            console.log(reslines);
            if(reslines[0].trim() == "yes") {
                var uid = reslines[1].trim();

                if(config.auth.whitelist.includes(uid)) {
                    logger.debug("IUCAS is valid, user is admin. IU id:" + uid);
                    issue_jwt(uid, function (err, jwt) {
                        if (err) return next(err);
                        console.log("issued token", jwt);
                        res.json({jwt: jwt, uid: uid, role: 'admin'});
                    });
                } else {
                    logger.error("IUCAS is valid, but user is not admin");
                    issue_jwt(uid, function (err, jwt) {
                        if (err) return next(err);
                        console.log("issued token", jwt);
                        res.json({jwt: jwt, uid: uid, role: 'user'});
                    });
                }
            } else {
                logger.error("IUCAS failed to validate");
                res.sendStatus("403");//Is 403:Forbidden appropriate return code?
            }
        } else {
            //non 200 code...
            next(body);
        }
    })
});


//////CRUD API for people table/////////////////
////////////////////////////////////////////////

//get people
router.get('/pvsys', function(req, res, next) {
    db.Pvsys.find({}, function(err, _pvsys){
        if(err){
            console.log(err);
            next();
        } else{
            res.json(_pvsys);
            console.log('retrieved all pv systems ', _pvsys.length);
        }
    })
});


//////////////EXPORT////////////

module.exports = router;
