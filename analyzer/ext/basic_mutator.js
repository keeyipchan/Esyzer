"use strict";
/**
 * @module
 * doing a base 'mutations':
 *  - linking an anonymous function in an AssignmentExpression to name
 *  - mark obj as a class on 'new'
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
    init: function (ast) {
    },
    enter: function (node) {
        var obj,left;
        switch (node.type) {

            case 'AssignmentExpression':
                left = this.analyzer.getObjectRef(node.left);
                if (!left) break;
                if (node.right.type == 'ObjectExpression') {
                    //x={};
                    if (left.isInstance) {
                        //x.prototype = {}
                        node.right.obj = left;
                    }
                } else if (node.right.type == 'FunctionExpression') {
                    //vx=function () {};
                    left.markAsFunction(node.right);
                }
                break;

            case 'NewExpression':
                obj = this.analyzer.getObjectRef(node.callee);
                if (!obj) break;
                obj.markAsClass();
                break;

            case 'Property':
                // x in { x:1 }
                obj = node.parent.obj;
                if (!obj) break;
                if (node.kind == 'init') {
                    var name = node.key.type == 'Identifier' ? node.key.name :
                        node.key.type == 'Literal' ? node.key.value : null;
                    if (name === null) throw 'unknown property key type:'+node.key.type;
                    var field = obj.addField(name);
                    //regular data property
                    if (node.value.type == 'FunctionExpression') {
                        // {x: function () {}
                        field.markAsFunction(node.value);
                    }
                }
        }

    },
    leave: function (node) {
    }
};


exports.BasicMutator = BasicMutator;