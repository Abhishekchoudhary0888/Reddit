define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/CommentUnit.ejs",
    "./CommentReply",
    "./util"
], function (declare, _WidgetBase, _Templated, CommentUnit, CommentReply, util) {

    return declare([_WidgetBase, _Templated], {
        templateString: CommentUnit,


        commentReplyClicked: function () {
            var that = this;
            require(["javascripts/PostUnit"], function (PostUnit) {
                var utilBase = new util(),
                    commentReply = new CommentReply({parentWidget: that.commentUnitNode, targetUnitWidget: that.targetWidget}),
                    post = new PostUnit();
                utilBase.set_targetId(post.unit.getAttribute('data-id'));
                utilBase.set_targetRepDiv(that.commentUnitNode);
                commentReply.placeAt(that.commentUnitNode);
            });
        },

        postCreate: function () {
            if (this.value) {
                this.commentUnitNode.prepend(this.value);
            }

            this.commentUnitNode.dataset.id = Date.now() + Math.round(Math.random());
        }
    });
});