'use strict';

define(['models/objectCollection', 'app', 'connection'],
    function (ObjectCollection, App, Connection){
    var connection = new Connection('http://localhost:3000/rest');
    var app = new App({
        connection: connection
    });

    Backbone.sync = function (method, model, options) {
        console.log('sync:',method,model,options);
    };

    app.start();


//    sceneManager.render();
});
