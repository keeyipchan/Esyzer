"use strict";
var fs = require('fs');
var config = require('../config.js');
var q = require('q');

var modules = undefined;

var loadDefer = q.defer();

function loadModuleList() {
    if (!modules) {
        fs.readdir(config.srcPath, function (err, files) {
            if (err) {
                console.log('Error reading module files: ', err)
            } else {
                modules = [];
                for (var v in files)
                    modules.push({id:files[v]});
                loadDefer.resolve();
            }
        });
    }
    return loadDefer.promise;
}

exports.getModules = function (req, res) {
    loadModuleList().then(function () {
        res.send(modules);
    })

};

