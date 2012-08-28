'use strict';

/**
 * Model of language object
 * properties:
 *  name
 *  fields
 *  type
 *  links
 */

define(['./js_objects'], function (JSObjects){
    var modules = {};
    Backbone.Relational.store.addModelScope(modules);
    var JSObject = Backbone.RelationalModel.extend({
        relations:[{
            type: Backbone.HasMany,
            key: 'fields',
            relatedModel: 'JSObject',
            collectionType: JSObjects
        }],
        defaults: function () {
            return {
                name:'<NoName>'
//                fields: [],
//                type: 'generic'
//                links: []
            }
        }
    });

    modules.JSObject = JSObject;

    return JSObject;
});
