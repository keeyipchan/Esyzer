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
//            classes: this.classList
        }
    },
    setSrc:function (src) {
        this.ast = parse(src, {loc:true});
        return this;
    },
    analyze: function () {
        analyzer.analyze(this.ast);
//        this.global = this.ast.scope.names;
//        this.exports = this.global.exports;
        this.analyzed = true;
//        this.classList = [];

//        var stack = [this.ast.scope];
//        while (stack.length) {
//            var scope = stack.pop();
//            for (var n in scope.names) {
//                scope.names[n].isClass && this.classList.push(scope.names[n].toJSON())
//            }
//            stack.concat(scope.inner);
//        }

        return this;
    }
};

exports.Module = Module;