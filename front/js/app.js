'use strict';

define(['models/modules', 'ui/module_panel'],
    function (Modules, ModulePanel) {
    var App = function (options) {
        this.$leftPanel = $('#leftPanel');
        this.modules = new Modules();
        this.modulePanel = new ModulePanel({modules: this.modules});
        this.$leftPanel.append(this.modulePanel.$el);

//        this.connection = options.connection;
        this.start();
    };

    App.prototype = {
        start : function () {
            this.modules.fetch();
        }
    };

    return App;
});
