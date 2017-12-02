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
                    var commentUnit = new CommentUnit({value: value, targetWidget: that.targetUnitWidget});
                    commentUnit.placeAt(that.parentWidget);
                    that.domNode.remove();

                    utilBase.set_commentObj_comment(value);
                    utilBase.set_commentObj_parrentid(that.parentWidget.getAttribute('data-id'));
                    utilBase.set_unitId(commentUnit.commentUnitNode.getAttribute('data-id'));
                    utilBase.set_targetId(that.targetUnitWidget.getAttribute('data-id'));

                    that.persistValueToDB('commentVal');
                }
            });
        },

        persistValueToDB: function(chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();
            
            if (chk == 'commentVal') {
                database.ref('Post/' + utilBase.get_targetId() + '/comments/' + utilBase.get_unitId()).update({
                    id: utilBase.get_unitId(),
                    comment: utilBase.get_commentObj().comment,
                    parentId: utilBase.get_commentObj().parrentid
                });
            }
        },

        replyCommentCancelBtnClicked: function () {
            this.domNode.remove();
        },

        postCreate: function () {
            var utilBase = new util();
            this.inherited(arguments);
        }
    });
});