"use strict";

define (function () {
    var ObjectTreeNode =Backbone.View.extend ({
        tagName: 'li',
        className: 'objectTreeNode',
        initialize: function () {
            console.log('init', this.model.attributes.name);
            this.model.on('change', this.render, this);
            this.model.on('reset', this.render, this);
            this.model.on('all', function () {console.log(this.attributes.name+': '+arguments)});
            this.render();
        },
        render : function () {
            console.log('render', this.model.get('name'));
            this.$el.text(this.model.get('name'));
        }
    });

    return ObjectTreeNode;
});