"use strict";

define(function () {
    var ObjectTreeNode = Backbone.View.extend({
        tagName: 'li',
        className: 'objectTreeNode',
        initialize: function () {
            this.$childs = undefined;
            console.log('init', this.model.attributes.name, this);
//            this.model.on('change', this.render, this);
//            this.model.on('reset', this.render, this);
            this.model.on('all', function () {console.log('All- ' + this.attributes.name + ': ', arguments)});
            this.render();
        },
        render: function () {
            var title = this.model.get('name');
            if (this.model.get('isClass') === true) this.$el.addClass('classNode');
            this.$el.append($('<div></div>').text(title));
            var childs = [];
            if (this.model.get('fields').length) {
                this.model.get('fields').forEach(function (m) {
                    var node = new ObjectTreeNode({model: m});
                    childs.push(node);
                }.bind(this));
            }
            if (this.model.get('instance')) {
                childs.push(new ObjectTreeNode({model: this.model.get('instance')}));
            };

            if (childs.length) {
                this.$childs = $('<ul></ul>').appendTo(this.$el);
                childs.forEach(function (c){this.$childs.append(c.$el);}.bind(this))
            }
        }
    });

    return ObjectTreeNode;
});