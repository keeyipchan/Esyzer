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
        $(window).on('resize', this.onWindowResize.bind(this));

        this.start();
    };

    App.prototype = {
        start : function () {
            this.modules.on('reset', function (){ this.modules.at(0).select()}.bind(this));
            this.modules.fetch();
        },
        onWindowResize: function () {
            this.$mainPanel.outerWidth(window.innerWidth - this.$leftPanel.outerWidth(true));
        }
    };

    return App;
});
