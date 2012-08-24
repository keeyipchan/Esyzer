'use strict';

var config = require('./config.js');
var express = require('express');
var app = express();
var moduleLoader = require('./back/module_loader.js');

app.get('/data/modules', moduleLoader.getModules);

app.get('/data/modules/:id', moduleLoader.getModule);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/front/index.html');
});

app.use( express.static(__dirname + '/front' ));


app.listen(3000);
console.log('Listening on port 3000');
