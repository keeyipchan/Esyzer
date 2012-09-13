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
var BasicLinker = function (analyzer) {
    this.analyzer = analyzer;
    this.context = analyzer.context;
};

BasicLinker.prototype = {
    init:function (ast) {
    },
    enter:function (node) {
        switch (node.type) {
            case 'AssignmentExpression':
                var left = this.analyzer.getObjectRef(node.left);
                if (!left) break;
                var right = this.analyzer.getObjectRef(node.right);
                if (right) {
                    left.addRef(right);
                }
                break;
        }
    },
    leave:function (node) {
    }
};


exports.BasicLinker = BasicLinker;