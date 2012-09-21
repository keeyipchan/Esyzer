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
    toJSON: function () {
        return {
            id: this.id,
            names : this.ast.scope.toJSON()
        }
    },
    toShortJSON: function () {
        return {
            id: this.id
        }
    },
    setSrc:function (src) {
        this.ast = parse(src, {loc:true});
        return this;
    },
    analyze: function () {
        analyzer.analyze(this.ast);
        this.resolveRefs();
        this.analyzed = true;

        return this;
    },
    resolveRefs: function (){

    }
};

exports.Module = Module;