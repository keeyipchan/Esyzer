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
    declareVarInScope:function (test) {
        ast = esprima.parse('var a;');
        analyzer.analyze(ast);
        test.ok(ast.scope.names !== undefined, 'Identifiers must be in in scope');
        test.ok('a' in ast.scope.names, 'Create identifier in scope');
        test.ok(ast.scope.names['a'].name === 'a', 'Store name as a property');
        test.done();
    },
    declareFunctionNameInScope:function (test) {
        ast = esprima.parse('function asd() {};');
        analyzer.analyze(ast);
        test.ok('asd' in ast.scope.names);
        test.ok(ast.scope.names['asd'].name === 'asd', 'Store name as a property');
        test.done();
    },
    declareArgumentsInScope:function (test) {
        ast = esprima.parse('var a;function asd(a,b) {};');
        analyzer.analyze(ast);
        test.ok('a' in ast.body[1].scope.names, 'Create function argument in scope');
        test.ok('b' in ast.body[1].scope.names, 'Create function argument in scope');
        test.done();
    }

};

exports.scope_linking = {
    linkAtoB:function (test) {
        ast = esprima.parse('var a,b;' +
            'a=b;');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['a'].ref === ast.scope.names['b'], 'Trivial linking a=b');

        test.done();
    },
    linkAtoBInDeclaration:function (test) {
        ast = esprima.parse('var b;' +
            'var a=b;');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['a'].ref === ast.scope.names['b'], 'Trivial linking var a=b');

        test.done();
    },
    linkAtoOutsideB:function (test) {
        ast = esprima.parse('var b;' +
            'function ttt() {' +
            'var a=b;' +
            '}');
        analyzer.analyze(ast);
        test.ok(ast.body[1].scope.names['a'].ref === ast.scope.names['b'], 'Identifiers must be in in scope');

        test.done();
    }
};

exports.mutating = {
    anonymousExpressionFuncNaming:function (test) {
        ast = esprima.parse('\
            var c,x=function(){};\
            c = function (){}\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['x'].isFunction, 'Deanonimizing function in variable declaration');
        test.ok(ast.scope.names['x'].node == ast.body[0].declarations[1].init, 'Node saving in variable declaration');
        test.ok(ast.scope.names['c'].isFunction, 'Deanonimizing function in assignment expression');
        test.ok(ast.scope.names['c'].node == ast.body[1].right, 'Node saving in in assignment expression');
        test.done();
    },
    convertToClassOnNew: function (test) {
        ast = esprima.parse('\
            var o,c=function(){};\
            o = new c();\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Create class from trivial new');
        test.done();
    },
    convertToClassOnPrototype: function(test) {
        ast = esprima.parse('\
            var o,c=function(){};\
            c.prototype.x = function() {}; \
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Create class from prototype access');
        test.done();
    }

};