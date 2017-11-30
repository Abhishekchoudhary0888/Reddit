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

        },
        replyCommentCancelBtnClicked: function () {

        }
    });
});