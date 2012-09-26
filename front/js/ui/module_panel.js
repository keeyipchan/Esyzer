'use strict';


define(function () {

    var ModulePanel = function (options) {
        this.$el = $('<div class="modulePanel scroll">');
        this.$header = $('<div class="header">Modules</div>').appendTo(this.$el);
        this.$list = $('<ul></ul>').appendTo(this.$el);
        this.modules = options.modules;
        this.modules.on('reset', this.render.bind(this));
        this.modules.on('change:analyzed', function (mod, val) {
            this.getItem(mod.id).addClass('analyzed');
        }.bind(this));
    };

    ModulePanel.prototype = {
        render: function () {
            this.$list.empty();
            this.modules.forEach(function (module) {
                $('<li></li>').text(module.id).attr('data-id', module.id).appendTo(this.$list)
                    .on('click', this.moduleClick.bind(this, module));
            }.bind(this))
        },

        getItem: function (id) {
            return this.$list.find('[data-id="'+id+'"]').eq(0);
        },
        moduleClick: function (module) {
            module.select();
        }
    };



    return ModulePanel;
});
