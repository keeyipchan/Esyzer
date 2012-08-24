"use strict";
var parse = require('esprima').parse;
var analyzer = require('./analyzer.js').analyzer;

var modules = {};

/**
 *
 * @param id
 * @constructor
 */
var Module = function (id) {
    this.id = id;
    this.global = undefined;
    this.exports = undefined;
    this.ast = undefined;
    this.analyzed = false;
};

Module.prototype = {
    setSrc:function (src) {
        this.ast = parse(src);
        return this;
    },
    analyze: function () {
        analyzer.analyze(this.ast);
        this.global = this.ast.scope.names;
        this.exports = this.global.exports;
        this.analyzed = true;
        return this;
    }
};

exports.Module = Module;