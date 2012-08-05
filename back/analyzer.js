"use strict";
"use strict";
var visitor = require('./node_visitor');
var JSObject = require('./jsobject').JSObject;
var Scope = require('./Scope').Scope;
var ScopeDeclarator = require('./modules/scope_declarator.js').ScopeDeclarator;
var BasicMutator = require('./modules/basic_mutator.js').BasicMutator;
var BasicLinker = require('./modules/basic_linker.js').BasicLinker;


//--------------------------------------

var Analyzer = function () {
    this.context = {
        scopeChain:[]
    };


    this.passes = [
        new ScopeDeclarator(this),
        new BasicMutator(this),
        new BasicLinker(this)
    ];

};

Analyzer.prototype = {
    getScope:function (node) {
        var x=1;
        while (!node.scope) {
            node = node.parent
        }
        return node.scope;
    },

    /**
     *  indicates the result of evaluating node is 'prototype' property of object
     * @param node
     */
    isPrototype:function (node) {
        if (node.type !== 'MemberExpression') return false;
        return node.property.type == 'Identifier' && node.property.name == 'prototype' && this.getObjectRef(node.object);
    },


    /** get the object referenced by node. Try to create objects and properties */
    getObjectRef:function (node) {
        var obj;

        if (node.type == 'Identifier') {
            return this.getScope(node).getObject(node.name)
        }
        if (node.type == 'NewExpression') {
            return this.getObjectRef(node.callee);
        }

        if (node.type == 'MemberExpression') {
            if (this.isPrototype(node.object) && node.property.type == 'Identifier') {
                //a.x.prototype.b ....
                obj = this.getObjectRef(node.object.object);

                obj.markAsClass();
                obj.instance.addField(node.property.name);
                return obj.instance.getChild(node.property.name);
            } else if (node.object.type == 'ThisExpression') {
                //this.x
                obj = this.getScope(node).node.obj;
                if (obj) {
                    if (!(obj.parent && obj.parent.isInstance)) obj.markAsClass();
                    else
                        obj = obj.parent.parent;

                    //this.x inside constructor
                    if (node.property.type == 'Identifier') {
                        var field = obj.instance.addField(node.property.name);
                    }
                }

            }

        }

        return null;
    },

    enterNode:function (node) {
        switch (node.type) {
//            case 'AssignmentExpression':
//                var left = getObjectRef(node.left);
//                if (!left) break;
//                if (left.ref) throw 'Multiple referencing';
//                var right = getObjectRef(node.right);
//                if (right) {
//                    left.ref = right;
//                } else if (node.right.type == 'FunctionExpression') {
//                    //vx=function () {};
//                    left.markAsFunction(node.right);
//                }
//                break;


//            case 'MemberExpression':
//                obj = getObjectRef(node.object);
//                if (!obj) break;
//                if (node.property.type == 'Identifier' && node.property.name == 'prototype') {
//                    obj.markAsClass();
//                }
//                break;
        }
    },


    analyze:function (ast) {
        for (var i = 0; i < this.passes.length; i++) {
            this.passes[i].init(ast);
            visitor.traverse(ast, this.passes[i]);
        }
    }
};

exports.analyzer = new Analyzer;