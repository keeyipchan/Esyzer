"use strict";
var parse = require('esprima').parse;
var analyzer = require('./analyzer.js').analyzer;

var modules = {};

/**
 *
 * @param id
 * @constructor
 */
var SimpleModule = function (id) {
    this.id = id;
    this.global = undefined;
    this.exports = undefined;
    this.ast = undefined;
    this.analyzed = false;
};

SimpleModule.prototype = {
    toJSON:function () {
        return {
            id:this.id,
            names:this.ast.scope.toJSON()
        }
    },
    toShortJSON:function () {
        return {
            id:this.id
        }
    },
    setSrc:function (src) {
        this.ast = parse(src, {loc:true});
        return this;
    },
    analyze:function () {
        analyzer.analyze(this.ast);
        this.global = this.ast.scope.names;

        for (var n in this.global) {
            this.resolveRefs(this.global[n]);
        }
        this.analyzed = true;

        return this;
    },
    resolveRefs:function (n) {
        var f,r;
        for (r in n.refs)
            n.refs[r].merge(n);

        for (f in n.fields)
            this.resolveRefs(n.fields[f]);

        if (n.isClass)
            for (f in n.instance.fields)
                this.resolveRefs(n.instance.fields[f]);

    }
};

exports.SimpleModule = SimpleModule;