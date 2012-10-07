"use strict";
var fs = require('fs');
var config = require('../config.js');
var q = require('q');
var Module = require('../analyzer/simple_module.js').SimpleModule;

var modules = exports.modules = {};

exports.loadModuleList = function() {
    var loadDefer = q.defer();
    fs.readdir(config.srcPath, function (err, files) {
        if (err) {
            console.log('Error reading module files: ', err);
            loadDefer.reject(err);
        } else {
            files.sort();
            for (var i = 0; i < files.length; i++) {
                var id = files[i];
                id.match(/\.js$/) && (modules[id] = new Module(id));
            }
            loadDefer.resolve();
        }
    });
    return loadDefer.promise;
}

exports.loadModule = function (id) {
    console.log('loading', id);
    var loadDefer = q.defer();
    if (!fs.existsSync(config.cachePath)) {
        fs.mkdirSync(config.cachePath);
    }
    if (!modules[id]) {
        if (!fs.existsSync(config.srcPath + '/' + id)) {
            //not in list
            loadDefer.reject();
        } else {
            modules[id] = new Module(id);
        }
    }

    if (modules[id] && !modules[id].analyzed) {

        if (fs.existsSync(config.cachePath + '/' + id)) {
            fs.readFile(config.cachePath + '/' + id, 'utf8', function (err, data) {
                if (err) {
                    console.log('Error reading cached module file: ', err);
                    loadDefer.reject(err);
                } else {
                    modules[id].cached = data;
                    modules[id].analyzed = true;
                    loadDefer.resolve();
                }
            })
        } else {
            fs.readFile(config.srcPath + '/' + id, 'utf8', function (err, data) {
                if (err) {
                    console.log('Error reading module file: ', err);
                    loadDefer.reject(err);
                } else {
                    console.log(id);
                    modules[id].setSrc(data);
                    modules[id].analyze();
                    modules[id].cached = JSON.stringify(modules[id].toJSON());
                    fs.writeFileSync(config.cachePath + '/' + id, modules[id].cached);
                    loadDefer.resolve();
                }
            })
        }
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
            mlist.push(modules[m].toShortJSON());
        }
        res.send(mlist);
    }, function (err) {
        res.send([]);
    })
};

exports.getModule = function (req, res) {
    loadModule(req.params.id).then(function () {
        try {
            var obj = modules[req.params.id];
            res.send(obj.toJSON());
        } catch (e) {
            console.log('Error in getModule:',req.params.id, e.message, e.stack);
        }
    }).fail(function (err) {
            res.send(err);
        })
};

