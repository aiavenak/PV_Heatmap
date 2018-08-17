/**
 * Created by youngmd on 5/17/18.
 */

var winston = require('winston');
var fs = require('fs');

exports.express = {
    port: 12809
};

exports.mongodb = 'mongodb://127.0.0.1';

exports.auth = {
    //default user object when registered
    default: {
        //scopes can be empty.. but don't remove it! (a lot of app expects scopes object to exist)
        scopes: {
            sca: ["user"],
        },
        gids: [ 1 ],
    },

    //issuer to use for generated jwt token
    iss: "http://localhost",
    //ttl for jwt
    ttl: 24*3600*1000, //1 day

    //TODO - fix this
    secret: 'shhhhhhared-secret',

    //Whitelist for API/admin access
    whitelist: ['youngmd','agopu','rperigo'],
    whitelist_ip: ['127.0.0.1']
};

exports.logger = {
    winston: {
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    var d = new Date();
                    return d.toString(); //show timestamp
                },
                level: 'debug',
                colorize: true
            }),
        ]
    },
};