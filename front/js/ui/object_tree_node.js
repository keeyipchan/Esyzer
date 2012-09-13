"use strict";

define(function () {
    var ObjectTreeNode = Backbone.View.extend({
        tagName: 'li',
        className: 'objectTreeNode',
        initialize: function () {
            this.$childs = undefined;
            this.$title = $('<div></div>').appendTo(this.$el);
            console.log('init', this.model.attributes.name, this);
//            this.model.on('change', this.render, this);
//            this.model.on('reset', this.render, this);
            this.model.on('all', function () {console.log('All- ' + this.attributes.name + ': ', arguments)});
            this.render();
        },
        render: function () {
            var title = this.model.get('name');
            var isClass =this.model.get('isClass');

            this.$title.text(title);

            if (isClass === true) $('<div></div>').addClass('classIcon').prependTo(this.$title);
            if (this.options.meta) $('<div></div>').addClass('metaIcon').prependTo(this.$title);
            var childs = [];
            if (this.model.get('fields').length) {
                this.model.get('fields').forEach(function (m) {
                    var node = new ObjectTreeNode({model: m, meta: isClass});
                    childs.push(node);
                }.bind(this));
            }
            if (this.model.get('instance')) {
                this.model.get('instance').get('fields').forEach(function (m) {
                    childs.push(new ObjectTreeNode({model: m}));
                });
            };

            if (childs.length) {
                this.$childs = $('<ul></ul>').appendTo(this.$el);
                childs.forEach(function (c){this.$childs.append(c.$el);}.bind(this))
            }
        }
    });

    return ObjectTreeNode;
});