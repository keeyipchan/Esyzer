"use strict";
var ModuleLoader = require('./back/module_loader.js');


ModuleLoader.loadModuleList().then(function () {

    console.log(123);
    ModuleLoader.loadModule('AuditCategories.js');

    for (var m in ModuleLoader.modules) {
        console.log('analyze:', ModuleLoader.modules[m].id);
        ModuleLoader.loadModule(ModuleLoader.modules[m].id).then(
            function () {
                console.log('end alanyze:', ModuleLoader.modules[m].id);
            },
            function () {
                console.log('error:');
            }
        );
    }
});
