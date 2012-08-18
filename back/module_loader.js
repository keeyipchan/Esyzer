"use strict";
var fs = require('fs');
var config = require('../config.js');

var modules = undefined;

function loadModuleList () {
    if (modules) return;
    fs.readdir(config.srcPath, function (err, files) {
        if (err) {
            console.log('Error reading module files: ', err)
        } else {
            modules = files;
        }
    });
}

exports.getModuleList = function (req, res) {
    loadModuleList();
//    console.log('asd')
    res.send([]);
};

