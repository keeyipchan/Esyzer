"use strict";
/**
 * @module
 *  preparing an ast for analyze
 *  add a 'parent' to each node for intensive traverse
 */

var Scope = require('../scope').Scope;

/**
 * @constructor
 */
var ASTPrepare = function (analyzer) {
    this.analyzer = analyzer;
    this.context = analyzer.context;
};

ASTPrepare.prototype = {
    init:function (ast) {
    },
    enter:function (node) {
    },
    leave:function (node) {
    }
};


exports.ASTPrepare = ASTPrepare;