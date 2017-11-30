define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/commentUnit.ejs",
    "./commentReply",
    "./util"
], function (declare, _WidgetBase, _Templated, commentUnitTemplate, commentReplyWidget, util) {

    return declare([_WidgetBase, _Templated], {
        templateString: commentUnitTemplate,

        commentReplyClicked: function () {
            var that = this;
            require(["javascripts/createpost"], function (createPostWidget) {
                var utilBase = new util(),
                    commentReply = new commentReplyWidget({parentWidget: that.commentUnitNode}),
                    post1 = new createPostWidget();
                //commentReply.parentWidget = parentWidget;
                utilBase.set_targetId(post1.unit.getAttribute('data-id'));
                utilBase.set_targetRepDiv(that.commentUnitNode);
                var outerDiv = that.commentUnitNode;
                commentReply.placeAt(outerDiv);

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