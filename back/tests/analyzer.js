'use strict';
var esprima = require('esprima');
var analyzer = require('../analyzer').analyzer;
var ast;
ast = esprima.parse('var a;function asd(a,b) {};');
try {
analyzer.analyze(ast);
}catch(e) {
    var x=2;
}
var x=1;


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

exports.mutating = {
    anonymousExpressionFuncNaming:function (test) {
        ast = esprima.parse('\
            var c,x=function(){};\
            c = function (){}\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['x'].isFunction, 'Deanonimizing function in variable declaration');
        test.ok(ast.scope.names['x'].node.type == 'FunctionExpression', 'Node saving in variable declaration');
        test.ok(ast.scope.names['c'].isFunction, 'Deanonimizing function in assignment expression');
        test.ok(ast.scope.names['c'].node == ast.body[1].expression.right, 'Node saving in in assignment expression');
        test.done();
    },
    assigningObjectToFunctionNode:function (test) {
        ast = esprima.parse('\
            var c = function () {},d;\
            d = function () {};\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].node.obj == ast.scope.names['c'], 'Associating object to function');
        test.ok(ast.scope.names['d'].node.obj == ast.scope.names['d'], 'Associating object to function');
        test.done();

    }
};

exports.class_analysis = {
    convertToClassOnNew:function (test) {
        ast = esprima.parse('\
            var o,c=function(){};\
            o = new c();\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Create class from trivial new');
        test.done();
    },
    convertToClassOnPrototype:function (test) {
        ast = esprima.parse('\
            var o,c=function(){};\
            c.prototype.x = function() {}; \
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Create class from prototype access');
        test.done();
    },

    convertToClassOnThisInConstructor:function (test) {
        ast = esprima.parse('\
            var c=function(){\
                    this.x=1;\
                },d;\
                d = function () {\
                    this.y = 2;\
                }\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Make class on \'this\' in constructor in VariableDeclaration');
        test.ok(ast.scope.names['d'].isClass, 'Make class on \'this\' in constructor in FunctionExpression');
        test.done();
    },

    classicPrototypeMethod:function (test) {
        ast = esprima.parse('\
            var c=function(){};\
            c.prototype.t = function (){}\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].instance.fields.t !== undefined, 'create field in class');
        test.ok(ast.scope.names['c'].instance.fields.t.isFunction, 'mark field as function');
        test.ok(ast.scope.names['c'].instance.fields.t.node == ast.body[1].expression.right, 'mark field as function');
        test.done();
    },

    trivialProperty:function (test){
        ast = esprima.parse('\
            var c=function(){this.x=1};\
            c.prototype.t = function (){this.y=2;}\
        ');
        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].instance.fields.x !== undefined, 'create property on \'this.x\' in constructor');
        test.ok(ast.scope.names['c'].instance.fields.y !== undefined, 'create property on \'this.x\' in method');
        test.done();
    },

    classPrediction: function (test) {
        ast = esprima.parse('\
            var a = new c;\
            var c=function(){};\
        ');

        analyzer.analyze(ast);
        test.ok(ast.scope.names['c'].isClass, 'Create class on guess');
        test.done();
    }
};

exports.linking = {
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
    },

    linkToClass: function (test) {
        ast = esprima.parse(
            'var B = function () {this.x= new ttt;};' +
            'function ttt() {' +
            'var a=new B;' +
            '}'
        );
        analyzer.analyze(ast);
        test.ok(ast.body[1].scope.names['a'].ref === ast.scope.names['B'], 'name linking to class on "new"');
        test.ok(ast.scope.names['B'].instance.fields.x.ref === ast.scope.names['ttt'], 'property linking to class');

        test.done();
    }

};
