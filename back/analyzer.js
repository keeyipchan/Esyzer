"use strict";
var visitor = require('./node_visitor');

var scopeChain = [];


function Scope(parent) {
    this.parent = parent || null;

    /** hash of names
     * each name is an object representing variable or function
     * variable:
     * { name:'<x>', type:'var', ref:... }
     * function:
     * { name:'<x>', type:'func', ??? }
     * @type {Object}
     */
    this.names = {};
}

Scope.prototype = {
    /** explicitly adds a new variable to scope */
    addVar:function (name) {
        if (this.names[name]) throw 'name ' + name + 'already defined'
        return this.names[name] = {
            name:name,
            scope: this,
            type:'var',
            ref:null
        }
    },
    addFunction:function (name) {
        if (this.names[name]) throw 'name ' + name + 'already defined'
        return this.names[name] = {
            name:name,
            scope: this,
            type:'func'
        }
    },
    getObject: function(name) {
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
                var init = getObjectRef(node.init);
                if (init) {
                    if (v.ref !== null) throw 'Multiple referencing';
                    v.ref = init
                }
            }
            break;

        case 'AssignmentExpression':
            var left = getObjectRef(node.left);
            if (!left) break;
            var right = getObjectRef(node.right);
            if (!right) break;
            if (left.type == 'var') {
                if (left.ref !== null) throw 'Multiple referencing';
                left.ref = right
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