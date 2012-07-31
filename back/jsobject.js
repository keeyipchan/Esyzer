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
    },

    markAsInstance: function () {
        this.isInstance = true;
    },

    markAsFunction:function (node) {
        if (this.isFunction) return;
        this.isFunction = true;
        this.node = node;
        node && (node.obj = this);
    },

//    markAsReference:function (ref) {
//        if (this.ref) {
//            throw Error('Trying to change reference.');
//        }
//        this.ref = ref;
//    },

    addField: function (name) {
        if (this.fields[name]) return;
        this.fields[name] = new JSObject(name, this);
    },

    getChild: function (name) {
        //todo: implement 'deep' search (name = a.b.c)
        return this.fields[name];
    }

};


exports.JSObject = JSObject;