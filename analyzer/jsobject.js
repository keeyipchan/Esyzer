"use strict";

var _ = require('underscore');

/** Represents all objects - functions, classes, properties, etc.
 *  can combine different types. (class+function) (function + method)
 *   a JS Objects:
 *   function
 *   method
 *   class
 * system-specific:
 *   variable  (can represent a link to another name.   a=b, a is reference to b)
 *
 * @constructor
 */
function JSObject(name, parent) {
    this.name = name;
    this.parent = parent;
    this.fields = {};
}

JSObject.prototype = {
    markAsClass:function () {
        if (this.isClass) return;
        this.isClass = true;

        /** container for properties of 'instance' */
        this.instance = new JSObject('<instance of '+this.name+'>', this);
        this.instance.markAsInstance();
        return this;
    },

    markAsInstance: function () {
        this.isInstance = true;
        return this;
    },

    markAsFunction:function (node) {
        if (this.isFunction) return;
        this.isFunction = true;
        this.node = node;
        node && (node.obj = this);
        return this;
    },
    markInternal: function () {
        this.internal = true;
        return this;
    },
//    markAsReference:function (ref) {
//        if (this.ref) {
//            throw Error('Trying to change reference.');
//        }
//        this.ref = ref;
//    },

    addField: function (name) {
        if (this.fields[name]) return this.fields[name];
        this.fields[name] = new JSObject(name, this);
        return this.fields[name];
    },

    getChild: function (name) {
        //todo: implement 'deep' search (name = a.b.c)
        return this.fields[name];
    },
    toJSON: function() {
        var res = {
            name: this.name,
            fields: _.map(this.fields, function (val) {
                return val.toJSON();
            })
        };
        if (this.isClass) {
            res.isClass = true;
            res.instance = this.instance.toJSON();
        }

        if (this.isInstance) res.isInstance = true;
        if (this.internal) res.internal = true;

        return res;
    }

};


exports.JSObject = JSObject;