"use strict";
"use strict";
var visitor = require('./node_visitor');
var JSObject = require('./jsobject').JSObject;
var Scope = require('./scope').Scope;
var ScopeDeclarator = require('./ext/scope_declarator').ScopeDeclarator;
var BasicMutator = require('./ext/basic_mutator').BasicMutator;
var BasicLinker = require('./ext/basic_linker').BasicLinker;


//--------------------------------------

var Analyzer = function () {
    this.context = {
    };


    this.passes = [
        new ScopeDeclarator(this),
        new BasicMutator(this),
        new BasicLinker(this)
    ];

};

Analyzer.prototype = {
    getScope: function (node) {
        var x = 1;
        while (!node.scope) {
            node = node.parent
        }
        return node.scope;
    },

    /**
     *  indicates the result of evaluating node is 'prototype' property of object
     * @param node
     */
    isPrototype: function (node) {
        if (node.type !== 'MemberExpression') return false;
        return node.property.type == 'Identifier' && node.property.name == 'prototype' && this.getObjectRef(node.object);
    },


    /** get the object referenced by node. Try to create objects and properties */
    getObjectRef: function (node) {
        var obj;

        if (node.type == 'Identifier') {
            return this.getScope(node).getObject(node.name)
        }
        if (node.type == 'NewExpression') {
            return this.getObjectRef(node.callee);
        }

        if (node.type == 'ThisExpression') {
            //this.x
            obj = this.getScope(node).node.obj;
            if (obj) {
                if (!(obj.parent && obj.parent.isInstance)) obj.markAsClass();
                else obj = obj.parent.parent;
                return obj;
            }
            return null
        }

        if (node.type == 'MemberExpression') {
            //completelly ignore `__proto__` as a property in member expression
            if (node.property.name == '__proto__') return null;
            if (this.isPrototype(node)) {
                //x.prototype
                obj = this.getObjectRef(node.object);
                obj.markAsClass();
                return obj.instance;
            } else if (this.isPrototype(node.object) && node.property.type == 'Identifier') {
                //a.x.prototype.b ....
                obj = this.getObjectRef(node.object.object);

                obj.markAsClass();
                return obj.instance.addField(node.property.name);
//                return obj.instance.getChild(node.property.name);
            } else if (node.object.type === 'ThisExpression' && node.property.type == 'Identifier') {
                //this.x inside constructor
                obj = this.getObjectRef(node.object);
                return obj.instance.addField(node.property.name);
//                return obj.instance.getChild(node.property.name);
            } else if (node.property.type == 'Identifier' && node.property.name !== 'prototype') {
                //something.x
                obj = this.getObjectRef(node.object);
                return obj.addField(node.property.name);
            }

        }

        return null;
    },

    analyze: function (ast) {
        for (var i = 0; i < this.passes.length; i++) {
            this.passes[i].init(ast);
            visitor.traverse(ast, this.passes[i]);
        }
    }
};

exports.analyzer = new Analyzer;