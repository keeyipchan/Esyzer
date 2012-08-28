'use strict';


define(function () {
    var ModuleExplorer = function (options) {
        this.$el = $('<div></div>').addClass('moduleExplorer');
        this.$header = $('<div class="header">&lt;Click on one of modules&gt;</div>').appendTo(this.$el);
        this.$list = $('<ul class="objectList"></ul>').appendTo(this.$el);


        this.modules = options.modules;
        this.modules.on('select', this.showModule, this);
        this.module = undefined;
    };

    ModuleExplorer.prototype = {
        showModule: function (module) {
            this.$header.text(module.id);
            if (this.module) this.module.off(null,null,this);
            this.module = module;
            this.module.on('all', this._onModule,this);
            module.fetch();
        },
        _onModule : function (m) {
            console.log(arguments);
        }
    };

    return ModuleExplorer;
});
