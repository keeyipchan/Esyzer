"use strict";
/**
 * @module
 */

var Scope = require('../scope').Scope;

/**
 * @constructor
 */
var PASS = function (analyzer) {
    this.analyzer = analyzer;
    this.context = analyzer.context;
};

PASS.prototype = {
    init:function (ast) {
    },
    enter:function (node) {
    },
    leave:function (node) {
    }
};


exports.PASS = PASS;