'use strict';
var esprima = require('esprima');
var analyzer = require('../analyzer');
var ast;

exports.scope_creation = {
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
        test.ok(ast.scope.names !== undefined, 'Identifiers must be in in scope');
        test.ok('a' in ast.scope.names, 'Create identifier in scope');
        test.ok(ast.scope.names['a'].name === 'a', 'Store name as a property');
        test.done();
    },
    declareFunctionNameInScope: function (test) {
        ast = esprima.parse('function asd() {};');
        analyzer.analyze(ast);
        test.ok('asd' in ast.scope.names);
        test.ok(ast.scope.names['asd'].name === 'asd', 'Store name as a property');
        test.done();
    },
    declareArgumentsInScope: function (test) {
        ast = esprima.parse('var a;function asd(a,b) {};');
        analyzer.analyze(ast);
        test.ok('a' in ast.body[1].scope.names, 'Create function argument in scope');
        test.ok('b' in ast.body[1].scope.names, 'Create function argument in scope');
        test.done();
    }

};

exports.scope_linking = {
    linkAtoB: function (test) {
        ast = esprima.parse('var a,b;' +
            'a=b;');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['a'].ref === ast.scope.names['b'], 'Identifiers must be in in scope');

        test.done();
    },
    linkAtoBInDeclaration: function (test) {
        ast = esprima.parse('var b;' +
            'var a=b;');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['a'].ref === ast.scope.names['b'], 'Identifiers must be in in scope');

        test.done();
    },
    linkAtoOutsideB: function (test) {
        ast = esprima.parse('var b;' +
            'function ttt() {' +
            'var a=b;' +
            '}');
        analyzer.analyze(ast);
        test.ok(ast.body[1].scope.names['a'].ref === ast.scope.names['b'], 'Identifiers must be in in scope');

        test.done();
    }
};