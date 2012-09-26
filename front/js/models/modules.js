'use strict';

define(['./module'], function (Module){
    var Modules = Backbone.Collection.extend({
        model : Module,
        url: 'data/modules',
        initialize: function () {
            this.on('reset', function () {
                this.forEach(function (m) {m.fetch()})
            }.bind(this));
        }
    });

    return Modules;
});
