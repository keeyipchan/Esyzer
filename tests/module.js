var Module = require('../analyzer/module').Module;

exports.module = {
    createModule: function (test) {
        src = ';';
        module = new Module('1').setSrc(src).analyze();
        test.ok(module.ast !== undefined, 'Assigning ast');
        test.ok(module.global === module.ast.scope.names, 'Use ast scope as a global');
        test.ok(module.exports === module.global.exports, 'Use exports global name as exports');

        test.done();
    },
    fillExports: function (test) {
        src = 'var T = function () {};\
                T.prototype = {};\
                exports.T = T;';
        module = new Module('1').setSrc(src).analyze();
        test.ok(module.exports !== undefined, 'Create exports');
        test.ok(module.exports.fields['T'] !== undefined, 'Create property in exports');
        test.ok(module.exports.fields['T'].ref === module.global['T'], 'Link exports property to object');

        test.done();
    }
};
