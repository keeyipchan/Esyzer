"use strict";
var visitor = require('./node_visitor');

var scopeChain = [];



function Scope(parent) {
    this.parent = parent || null;
}

Scope.prototype = {

};


function enterNode(node) {
    switch (node.type) {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
            node.scope = {};
            node.scope.parent = scopeChain[scopeChain.length - 1];
            scopeChain.push(node.scope);
            break;

        case 'VariableDeclarator':
            scope().addVar(node);
    }
}


function leaveNode(node) {
    scopeChain.pop();
}

exports.analyze = function (ast) {
    ast.scope = ast.scope || Scope;
    scopeChain = [ast.scope];

    visitor.traverse(ast, {enter:enterNode, leave:leaveNode});
};