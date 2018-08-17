var express = require('express');
var path = require("path");

module.exports = function (app) {

    app.get('/*', function (req, res) {
        res.render(__dirname + '/index'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
