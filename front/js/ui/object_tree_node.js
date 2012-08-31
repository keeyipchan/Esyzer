"use strict";

define(function () {
    var ObjectTreeNode = Backbone.View.extend({
        tagName: 'li',
        className: 'objectTreeNode',
        initialize: function () {
            this.$childs = undefined;
            console.log('init', this.model.attributes.name);
//            this.model.on('change', this.render, this);
//            this.model.on('reset', this.render, this);
            this.model.on('all', function () {console.log('All- ' + this.attributes.name + ': ', arguments)});
            this.render();
        },
        render: function () {
            var title = this.model.get('name');
            if (this.model.get('isClass') === true) title='<class> '+title;
            this.$el.append($('<div></div>').text(title));
            if (this.model.get('fields').length) {
                this.$childs = $('<ul></ul>').appendTo(this.$el);
                this.model.get('fields').forEach(function (m) {
                    var node = new ObjectTreeNode({model: m});
                    this.$childs.append(node.$el);
                }.bind(this));
            }
        }
    });

    return ObjectTreeNode;
});