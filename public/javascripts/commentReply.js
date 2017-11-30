define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/replyCommentBlock.ejs",
    "./util"
], function (declare, _WidgetBase, _Templated, replyCommentTemplate, util) {


    return declare([_WidgetBase, _Templated], {
        templateString: replyCommentTemplate,


        replyCommentSaveBtnClicked: function () {

            var that = this;
            var value = this.replyTextareaBox.value;
            require(["javascripts/createCommentUnit"], function (CommentUnit) {

                if (value) {
                    var commentUnit = new CommentUnit({value: value});
                    commentUnit.placeAt(that.parentWidget);
                    that.domNode.remove();
                }
            });
        },

        replyCommentCancelBtnClicked: function () {

        }
    });
});