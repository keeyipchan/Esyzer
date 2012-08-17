'use strict';


define(function () {
    var ModulePanel = function (options) {
        this.$el = $('<div>');
        this.modules = options.modules;
        this.modules.on('all', this.render());
    };

    ModulePanel.prototype = {
        render: function () {
            this.$el.empty();
        }
    };

    return ModulePanel;
});
