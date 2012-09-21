"use strict";
/**
 * @module
 *
 * Creates a basic scopes associated with nodes (ast root and functions)
 *
 * analyze variable declarations and create a names in scopes instead
 * variable declaration removed, if there any <init> part exists it is converted to AssignmentExpression
 * also creates a names for function declarations
 */

var Scope = require('../scope').Scope;

/**
 * @constructor
 */
var ScopeDeclarator = function (analyzer) {
    this.analyzer = analyzer;
//    this.scopeChain = [];
    this.scope = undefined;
};

ScopeDeclarator.prototype = {
    init:function (ast) {
        this.scope = ast.scope = ast.scope || new Scope(undefined, ast);

//        this.scopeChain = [ast.scope];
    },
    mutateVariableDeclaration: function (node) {
        var declarations = node.declarations;
        var assignments = [];
        var i;
        delete node.declarations;
        delete node.kind;
        for (i=0;i<declarations.length;i++) {
            var v = this.analyzer.getScope(node).addVar(declarations[i].id.name).markInternal();
            if (declarations[i].init) {
//                if (v.ref) throw 'Multiple referencing';
                assignments.push({
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": declarations[i].id,
                        "right": declarations[i].init
                    }
                })
            }
        }
        if (assignments.length) {
            node.type = "BlockStatement";
            node.body = [];
            for (i=0;i<assignments.length;i++) {
                node.body.push(assignments[i]);
            }
        } else {
            node.type = "EmptyStatement";
        }
    },
    enter:function (node) {
        switch (node.type) {
            case 'FunctionDeclaration':
                this.analyzer.getScope(node).getObject(node.id.name).markAsFunction();
            case 'FunctionExpression':
                this.scope = node.scope = new Scope(this.scope, node);
//                this.scopeChain.push(node.scope);

                for (var i = 0; i < node.params.length; i++)
                    node.scope.addVar(node.params[i].name).markAsArgument();
                break;

            case 'VariableDeclaration':
                this.mutateVariableDeclaration(node);
                return 3; //retry
        }

    },
    leave:function (node) {
        switch (node.type) {
            case 'FunctionDeclaration':
            case 'FunctionExpression':
//                this.scopeChain.pop();
                this.scope = this.scope.parent;
                break;
        }
    }
};


exports.ScopeDeclarator = ScopeDeclarator;