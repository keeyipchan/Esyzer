"use strict";
/**
 * @module
 * doing a base 'mutations':
 *  - linking an anonymous function in an AssignmentExpression to name
 */

var Scope = require('../scope').Scope;

/**
 * @constructor
 */
var BasicMutator = function (analyzer) {
    this.analyzer = analyzer;
    this.context = analyzer.context;
};

BasicMutator.prototype = {
    init:function (ast) {
        ast.scope = ast.scope || new Scope(undefined, ast);
        this.context.scopeChain = [ast.scope];
    },
    enter:function (node) {
        switch (node.type) {
            case 'AssignmentExpression':
                var left = this.analyzer.getObjectRef(node.left);
                if (left && node.right.type == 'FunctionExpression') {
                    //vx=function () {};
                    left.markAsFunction(node.right);
                }
                break;
        }

    },
    leave:function (node) {
    }
};


exports.BasicMutator = BasicMutator;