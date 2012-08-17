'use strict';

define(['app'],
    function (App){
    var app = new App;

    Backbone.sync = function (method, model, options) {
        console.log('sync:',method,model,options);
    };



//    sceneManager.render();
});
