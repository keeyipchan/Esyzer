"use strict";

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
function JSObject(name) {
    this.name = name;
    this.fields = {};
}

JSObject.prototype = {
    markAsClass:function () {
        if (this.isClass) return;
        this.isClass = true;
    },

    markAsFunction:function (node) {
        if (this.isFunction) return;
        this.isFunction = true;
        this.node = node;
    },

    markAsReference:function (ref) {
        if (this.ref) {
            throw Error('Trying to change reference.');
        }
        this.ref = ref;
    },

    addField: function (name) {
        if (this.fields[name]) return;
        this.fields[name] = new JSObject(name);
    },

    getChild: function (name) {
        //todo: implement 'deep' search (name = a.b.c)
        return this.fields[name];
    }

};


exports.JSObject = JSObject;