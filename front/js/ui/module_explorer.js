'use strict';


define(['./object_tree_node'], function (ObjectTreeNode) {
    var ModuleExplorer = function (options) {
        this.$el = $('<div></div>').addClass('moduleExplorer');
        this.$header = $('<div class="header">&lt;Click on one of modules&gt;</div>').appendTo(this.$el);
        this.$list = $('<ul class="objectList"></ul>').appendTo(this.$el);

//        this.$list.on('mousedown', this.onMouseDown.bind(this));
//        this.$list.on('mouseup', this.onMouseUp.bind(this));
        this.mouseMoveBinded = this.onMouseMove.bind(this);
        this.mouse = {x: undefined, y: undefined};

        this.modules = options.modules;
        this.modules.on('select', this.showModule, this);
        this.module = undefined;
    };

    ModuleExplorer.prototype = {
        showModule: function (module) {
            this.$header.text(module.id);
            if (this.module) this.module.off(null, null, this);
            this.module = module;
            this.$list.empty();
//            this.module.on('all', function (m) { console.log(arguments); });
            this.module.on('add:names', this._onModuleNameAdd, this);
            module.fetch();
        },
        _onModuleNameAdd: function (m) {
            console.log('add:', arguments);
            var node = new ObjectTreeNode({model: m});
            this.$list.append(node.$el);
        },
        onMouseDown: function (e) {
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
            $(document).on('mousemove', this.mouseMoveBinded);
        },
        onMouseUp: function (e) {
            $(document).off('mousemove', this.mouseMoveBinded);
        },
        onMouseMove: function (e) {
            var deltaX = e.pageX - this.mouse.x;
            var deltaY = e.pageY - this.mouse.y;
            this.mouse.y = e.pageY;
            this.mouse.x = e.pageX;
            this.$list.scrollTop(this.$list.scrollTop() - deltaY);
            this.$list.scrollLeft(this.$list.scrollLeft() - deltaX);
        }
    };

    return ModuleExplorer;
});
