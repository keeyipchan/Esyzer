"use strict";
var visitor = require('./node_visitor');

var scopeChain = [];

/** Represents all objects - functions, classes, properties, etc.
 *  can combine different types. (class+function) (function + method)
 *   a JS Objects:
 *   function
 *   method
 *   class
 * system-specific:
 *   variable  (can represent a link to another name.   a=b, a is reference to b)
 *
 * @constructor
 */
function JSObject(scope, name) {
    this.scope = scope;
    this.name = name;
    this.fields = {};
}

JSObject.prototype.markAsClass = function () {
    if (this.isClass) return;
    this.isClass = true;
};

JSObject.prototype.markAsFunction = function (node) {
    if (this.isFunction) return;
    this.isFunction = true;
    this.node = node;
};

JSObject.prototype.markAsReference = function (ref) {
    if (this.ref) {
        throw Error('Trying to change reference.');
    }
    this.ref = ref;
};

function Scope(parent) {
    this.parent = parent || null;

    /** hash of names
     * each name is an JSObject
     */
    this.names = {};
}

Scope.prototype = {
    /** explicitly adds a new variable to scope */
    addVar:function (name) {
        if (this.names[name]) throw 'name ' + name + 'already defined'
        this.names[name] = new JSObject(this, name);
        return this.names[name];
    },
    addFunction:function (name) {
        if (this.names[name]) throw 'name ' + name + 'already defined'
        this.names[name] = new JSObject(this, name);
        this.names[name].markAsFunction();
        return this.names[name];
    },
    getObject:function (name) {
        if (this.names[name]) return this.names[name];
        if (this.parent) return this.parent.getObject(name);
        return null;
    }
};

//--------------------------------------
function getScope() {
    return scopeChain[scopeChain.length - 1];
}

function getObjectRef(node) {
    if (node.type == 'Identifier') {
        return getScope().getObject(node.name)
    }

    return null;
}

function enterNode(node) {
    switch (node.type) {
        case 'FunctionDeclaration':
            getScope().addFunction(node.id.name);
        case 'FunctionExpression':
            node.scope = new Scope(scopeChain[scopeChain.length - 1]);
            scopeChain.push(node.scope);
            for (var i = 0; i < node.params.length; i++)
                node.scope.addVar(node.params[i].name)
            break;

        case 'VariableDeclarator':
            var v = getScope().addVar(node.id.name);
            if (node.init) {
                if (v.ref) throw 'Multiple referencing';
                var init = getObjectRef(node.init);
                if (init) {
                    v.ref = init
                } else if (node.init.type == 'FunctionExpression') {
                    //var x=function () {};
                    v.markAsFunction(node.init);
                }

            }
            break;

        case 'AssignmentExpression':
            var left = getObjectRef(node.left);
            if (!left) break;
            if (left.ref) throw 'Multiple referencing';
            var right = getObjectRef(node.right);
            if (right) {
                left.ref = right;
            } else if (node.right.type == 'FunctionExpression') {
                //vx=function () {};
                left.markAsFunction(node.init);
            }
            break;

        case 'NewExpression':
            var obj = getObjectRef(node.callee);
            if (!obj) break;
            obj.markAsClass();
            break;

        case 'MemberExpression':
            obj = getObjectRef(node.object);
            if (!obj) break;
            if (node.property.type == 'Identifier' && node.property.name == 'prototype') {
                obj.markAsClass();
            }
            break;
    }
}


function leaveNode(node) {
    switch (node.type) {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
            scopeChain.pop();
            break;
    }
}

exports.analyze = function (ast) {
    ast.scope = ast.scope || new Scope();
    scopeChain = [ast.scope];

    visitor.traverse(ast, {enter:enterNode, leave:leaveNode});
};