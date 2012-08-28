'use strict';

/**
 * Model of module
 * properties:
 *  name
 *  global
 *  type
 */

define(['./js_object', './js_objects'], function (JSObject, JSObjects){
    var Module = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'names',
            relatedModel: JSObject,
            collectionType: JSObjects
        }],
        defaults: function () {
            return {
                id:'<NoName>',
                type: 'generic'
            }
        },
        select : function () {
            this.trigger('select', this);
        }
    });

    return Module;
});
