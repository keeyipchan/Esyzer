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
    this.context = analyzer.context;
};

ScopeDeclarator.prototype = {
    init:function (ast) {
        ast.scope = ast.scope || new Scope(undefined, ast);
        this.context.scopeChain = [ast.scope];
    },
    enter:function (node) {
        switch (node.type) {
            case 'FunctionDeclaration':
                this.analyzer.getScope().getObject(node.id.name).markAsFunction();
            case 'FunctionExpression':
                node.scope = new Scope(this.context.scopeChain[this.context.scopeChain.length - 1], node);
                this.context.scopeChain.push(node.scope);
                for (var i = 0; i < node.params.length; i++)
                    node.scope.addVar(node.params[i].name)
                break;

            case 'VariableDeclarator':
                var v = this.analyzer.getScope().addVar(node.id.name);
                if (node.init) {
                    if (v.ref) throw 'Multiple referencing';
                    var init = this.analyzer.getObjectRef(node.init);
                    if (init) {
                        v.ref = init
                    }

                }
                break;
        }

    },
    leave:function (node) {
        switch (node.type) {
            case 'FunctionDeclaration':
            case 'FunctionExpression':
                this.context.scopeChain.pop();
                break;
        }
    }
};


exports.ScopeDeclarator = ScopeDeclarator;