'use strict';

/**
 * Model of module
 * properties:
 *  name
 *  global
 *  type
 */

define( function (){
    var ModuleModel = Backbone.Model.extend({
        defaults: function () {
            return {
                name:'<NoName>',
                type: 'generic'
            }
        }
    });

    return ModuleModel;
});
