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
    this.fields = [];
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


    addField:function (name, obj) {
        var f;
        if (f = this.getField(name)) return f;
        f = { name:name, obj: obj ? obj : new JSObject(name, this)};
        this.fields.push(f);
        return f.obj;
    },

    getField:function (name) {
        for (var i = 0; i < this.fields.length; i++) {
            if (this.fields[i].name == name) return this.fields[i].obj;
        }
        return null;
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
                return val.obj.toJSON();
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
    merge:function (obj) {
        for (var i = 0;i<obj.fields.length;i++) {
            var s = obj.fields[i].name;
            if (!this.getField(s)) {
                this.addField(s, new JSObject(s, this));
            }
            this.getField(s).merge(obj.getField(s))
        }
        if (this.isClass && obj.isClass) {
            this.instance.merge(obj.instance);
        }
    }

};


exports.JSObject = JSObject;