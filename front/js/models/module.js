'use strict';

/**
 * Model of module
 * properties:
 *  name
 *  global
 *  type
 */

define( function (){
    var Module = Backbone.Model.extend({
        defaults: function () {
            return {
                id:'<NoName>',
                type: 'generic'
            }
        }
    });

    return Module;
});
