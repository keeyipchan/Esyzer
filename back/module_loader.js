"use strict";
var fs = require('fs');
var config = require('../config.js');
var q = require('q');

var modules = undefined;

function loadModuleList () {
    if (modules) return;
    var def = q.defer();
    fs.readdir(config.srcPath, function (err, files) {
        if (err) {
            console.log('Error reading module files: ', err)
        } else {
            modules = files;
            def.resolve();
        }
    });
    return def.promise;
}

exports.getModuleList = function (req, res) {
    loadModuleList().then(function () {
        res.send(modules);
    })

};

