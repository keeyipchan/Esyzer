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
    this.refs = [];//references to other objects  (typically a=b)
}

JSObject.prototype = {
    markAsClass:function () {
        if (this.isClass) return;
        this.isClass = true;

        /** container for properties of 'instance' */
        this.instance = new JSObject('<instance of ' + this.name + '>', this);
        this.instance.markAsInstance();
        return this;
    },

    markAsInstance:function () {
        this.isInstance = true;
        return this;
    },

    markAsArgument:function () {
        this.isArgument = true;
        return this;
    },

    markAsFunction:function (node) {
        if (this.isFunction) return;
        this.isFunction = true;
        this.node = node;
        node && (node.obj = this);
        return this;
    },
    markInternal:function () {
        this.internal = true;
        return this;
    },
//    markAsReference:function (ref) {
//        if (this.ref) {
//            throw Error('Trying to change reference.');
//        }
//        this.ref = ref;
//    },

    addField:function (name) {
        if (this.fields.hasOwnProperty(name)) return this.fields[name];
        this.fields[name] = new JSObject(name, this);
        return this.fields[name];
    },

    getChild:function (name) {
        if (!this.fields.hasOwnProperty(name)) return null;
        //todo: implement 'deep' search (name = a.b.c)
        return this.fields[name];
    },

    addRef:function (to) {
        if (this.refs.indexOf(to) !== -1) return this;
        this.refs.push(to);
        return this;
    },

    getPath:function () {
        var path = this.parent ? this.parent.getPath() + '.' : '';
        var name = this.isArgument ? 'arg:' : '';
        return path + name + this.name;
    },

    toJSON:function () {
        var res = {
            name:this.name,
            fields:_.map(this.fields, function (val) {
                return val.toJSON();
            })
        };
        if (this.isClass) {
            res.isClass = true;
            res.instance = this.instance.toJSON();
        }

        if (this.isInstance) res.isInstance = true;
        if (this.internal) res.internal = true;
        if (this.refs.length) res.refs = this.refs.map(function (ref) {
            return ref.getPath()
        });

        return res;
    },
    merge: function (obj) {
        for (var s in obj.fields) {
            if (!this.fields[s]) {
                this.fields[s] = new JSObject(s, this);
            }
            this.fields[s].merge(obj.fields[s])
        }
        if (this.isClass && obj.isClass) {
            this.instance.merge(obj.instance);
        }
    }

};


exports.JSObject = JSObject;