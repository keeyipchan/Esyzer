'use strict';

define(['models/modules', 'ui/module_panel', 'ui/module_explorer'],
    function (Modules, ModulePanel, ModuleExplorer) {
    var App = function (options) {
        this.$leftPanel = $('#leftPanel');
        this.$mainPanel = $('#mainPanel');
        this.modules = new Modules();
        this.modulePanel = new ModulePanel({modules: this.modules});
        this.$leftPanel.append(this.modulePanel.$el);

        this.moduleExplorer = new ModuleExplorer({modules: this.modules});
        this.$mainPanel.append(this.moduleExplorer.$el);

        this.start();
    };

    App.prototype = {
        start : function () {
            this.modules.fetch();
        }
    };

    return App;
});
