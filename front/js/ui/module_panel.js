'use strict';


define(function () {

    var ModulePanel = function (options) {
        this.$el = $('<div class="modulePanel scroll">');
        this.$header = $('<div class="header">Modules</div>').appendTo(this.$el);
        this.$list = $('<ul></ul>').appendTo(this.$el);
        this.modules = options.modules;
        this.modules.on('reset', this.render.bind(this));
    };

    ModulePanel.prototype = {
        render: function () {
            this.$list.empty();
            this.modules.forEach(function (module) {
                $('<li></li>').text(module.id).appendTo(this.$list)
                    .on('click', this.moduleClick.bind(this, module));
            }.bind(this))
        },

        moduleClick: function (module) {
            module.select();
        }
    };



    return ModulePanel;
});
