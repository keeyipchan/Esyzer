'use strict';

define(['./js_object'], function (JSObject){
    var ObjectCollection = Backbone.Collection.extend({
        model: JSObject
    });

    return ObjectCollection;
});
