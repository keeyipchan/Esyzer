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
        if (this.cached && this.analyzed) return this.cached;
        return {
            id:this.id,
            analyzed:true,
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

        for (var i=0;i<this.global.length;i++) {
            this.resolveRefs(this.global[i]);
        };
        this.analyzed = true;

        return this;
    },
    resolveRefs:function (n) {
        var i,r;
        for (r in n.refs)
            n.refs[r].merge(n);

        for (i=0;i<n.fields.length;i++)
            this.resolveRefs(n.fields[i]);

        if (n.isClass)
            for (i=0;i<n.instance.fields.length;i++)
                this.resolveRefs(n.instance.fields[i]);

    }
};

exports.SimpleModule = SimpleModule;