"use strict";
var fs = require('fs');
var config = require('../config.js');
var q = require('q');
var Module = require('../analyzer/module.js').Module;

var modules = {};

function loadModuleList() {
    var loadDefer = q.defer();
    fs.readdir(config.srcPath, function (err, files) {
        if (err) {
            console.log('Error reading module files: ', err);
            loadDefer.reject(err);
        } else {
            for (var i = 0; i < files.length; i++) {
                var id = files[i];
                id.match(/\.js$/) && (modules[id] = new Module(id));
            }
            loadDefer.resolve();
        }
    });
    return loadDefer.promise;
}

function loadModule(id) {
    var loadDefer = q.defer();
    if (!modules[id]) {
        if (!fs.existsSync(config.srcPath + '/' + id)) {
            //not in list
            loadDefer.reject();
        } else {
            modules[id] = new Module(id);
        }
    }

    if (modules[id] && !modules[id].analyzed) {
        fs.readFile(config.srcPath + '/' + id, 'utf8', function (err, data) {
            if (err) {
                console.log('Error reading module file: ', err);
                loadDefer.reject(err);
            } else {
                modules[id].setSrc(data);
                modules[id].analyze();
                loadDefer.resolve();
            }
        })
    } else {
        //already loaded
        loadDefer.resolve();
    }
    return loadDefer.promise;
}

exports.getModules = function (req, res) {
    loadModuleList().then(function () {
        var mlist = [];
        for (var m in modules) {
            mlist.push(modules[m]);
        }
        res.send(mlist);
    }, function (err) {
        res.send([]);
    })
};

exports.getModule = function (req, res) {
    loadModule(req.params.id).then(function () {
        try {
        var obj =modules[req.params.id];
        res.send(obj.toJSON());
        }catch (e) {
            console.log('Error in getModule:', e.message);
        }
    }).fail(function (err) {
        res.send(err);
    })
};

