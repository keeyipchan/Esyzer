'use strict';
var Module = require('../analyzer/module').Module;
var fs = require('fs');

exports.test_real_file = function (test) {
    fs.readFile('tests/src/testing.js', 'utf8', function (err, data) {
        if (err) {
            console.log('Error reading file: ', err);
        } else {
            var module = new Module;
            module.setSrc(data);
            module.analyze();

        }
    })
}

