'use strict';

define(['./module'], function (Module){
    var Modules = Backbone.Collection.extend({
        model : Module,
        url: 'data/modules'
    });

    return Modules;
});
