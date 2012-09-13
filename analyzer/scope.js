'use strict';

var JSObject = require('./jsobject.js').JSObject;
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
    /** hash of names
     * each name is an JSObject
     */
    this.names = {};
}

Scope.prototype = {
    /** explicitly adds a new variable to scope */
    addVar:function (name) {
        if (this.names[name])
            return this.names[name];
        //todo: there can be overriding of local names (vars, arguments functions) - think about it
//            throw Error('name ' + name + ' already defined');
        this.names[name] = new JSObject(name);
        return this.names[name];
    },
    addFunction:function (name) {
        return this.addVar(name).markAsFunction();
    },
    getObject:function (name) {
        if (this.names[name]) return this.names[name];
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