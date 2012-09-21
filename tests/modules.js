'use strict';
var Module = require('../analyzer/simple_module.js').SimpleModule;
exports.module_test = {
    createModule: function (test) {
        var src = ';';
        var module = new Module('1').setSrc(src).analyze();
        test.ok(module.ast !== undefined, 'Assigning ast');
        test.ok(module.global === module.ast.scope.names, 'Use ast scope as a global');
//        test.ok(module.exports === module.global.exports, 'Use exports global name as exports');

        test.done();
    },
//    fillExports: function (test) {
//        var src = 'var T = function () {};\
//                T.prototype = {};\
//                exports.T = T;';
//        var module = new Module('1').setSrc(src).analyze();
//        test.ok(module.exports !== undefined, 'Create exports');
//        test.ok(module.exports.fields['T'] !== undefined, 'Create property in exports');
//        test.ok(module.exports.fields['T'].ref === module.global['T'], 'Link exports property to object');
//
//        test.done();
//    },
    resolveLocalRefs: function (test) {
        var src = 'var x = function () {\
                this.tt = new obj;\
                this.tt.f = 1;\
            };\
            var a = new x;\
            a.d = 123;\
            ';
        var module = new Module('1').setSrc(src).analyze();

        test.ok(module.global['x'].instance.fields.d !== undefined);
        test.ok(module.global['obj'].instance.fields.f !== undefined, 'deep merge');
        test.done();
    }
};
