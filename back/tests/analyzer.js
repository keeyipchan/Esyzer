'use strict';
var esprima = require('esprima');
var analyzer = require('../analyzer');
var ast;
exports.scope = {
    createScope:function (test) {
        ast = esprima.parse(';');
        analyzer.analyze(ast);
        test.ok('scope' in ast, 'Global scope creation');
        test.done();
    },
    createFunctionScope:function (test) {
        ast = esprima.parse('function asd() {};');
        analyzer.analyze(ast);
        test.ok('scope' in ast.body[0], 'function scope creation');
        test.equal(ast.body[0].scope.parent, ast.scope, 'function scope parent');
        test.done();
    },
    createFunctionExpressionScope:function (test) {
        ast = esprima.parse('!function () {};');
        analyzer.analyze(ast);
        test.ok('scope' in ast.body[0].expression.argument, 'function scope creation');
        test.done();
    },
    declareVarInScope: function (test) {
        ast = esprima.parse('var a;');
        analyzer.analyze(ast);
        test.ok(ast.ids !== undefined, 'identifiers in scope');
        test.done();
    }
};