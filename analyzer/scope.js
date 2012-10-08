'use strict';

var JSObject = require('./jsobject.js').JSObject;
var JSObjectList = require('./jsobject.js').JSObjectList;
var _ = require('underscore');

/**
 *  Represents current scope and executional context
 * @param parent
 * @param node - functional node
 * @constructor
 */
function Scope(parent, node) {
    this.parent = parent || null;
    this.node = node;
    //inner scopes
    this.inner = [];

    if (parent) parent.inner.push(this);

    this.names = new JSObjectList;
}

Scope.prototype = {
    /** explicitly adds a new variable to scope */
    addVar:function (name) {
        var n;
        if (n = this.names.get(name)) return n;
        //todo: there can be overriding of local names (vars, arguments functions) - think about it
//            throw Error('name ' + name + ' already defined');
        return this.names.add(name);
    },
    getObject:function (name) {
        var n;
        if (n = this.names.get(name)) return n;
        if (this.parent) return this.parent.getObject(name);
        return this.addVar(name);
    },
    toJSON: function () {
        return _.map(this.names, function (val, key) {
            return val.toJSON();
        });
    }
};

exports.Scope = Scope;