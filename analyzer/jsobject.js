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
    this.fields = new JSObjectList(this);
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
        return this.fields.add(name, obj);
    },

    getField:function (name) {
        return this.fields.get(name);
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
    merge:function (obj) {
        for (var i = 0; i < obj.fields.length; i++) {
            var s = obj.fields[i].name;
            if (!this.getField(s)) {
                this.addField(s);
            }
            this.getField(s).merge(obj.getField(s))
        }
        if (this.isClass && obj.isClass) {
            this.instance.merge(obj.instance);
        }
    }

};




/*****************************************/
/**
 * @param parent parent for added objects
 * @constructor
 */
var JSObjectList = function (parent) {
    this.length = 0;
    this.parent = parent;
};

JSObjectList.prototype = {
    get: function (name) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].name == name) return this[i];
        }
        return null;
    },
    add: function (name, obj) {
        var f;
        if (f = this.get(name)) return f;
        f =  new JSObject(name, this.parent);
        this.push(f);
        return f;
    }
};

//noinspection JSValidateTypes
JSObjectList.prototype.__proto__ = Array.prototype;


exports.JSObject = JSObject;
exports.JSObjectList = JSObjectList;

