define([
    "dojo/_base/declare",
    "dijit/_Widget"
], function (declare, _Widget) {
    var obj = {},
        elTarget = null,
        elCount = 0,
        commentVal = null,
        commentObj = {},
        targetRepDiv = null,
        replySpanDom = null,
        targetId = null,
        unitId = null;

    return declare([_Widget], {
        get_obj: function () {
            return obj;
        },
        set_obj_id: function (updatedValue) {
            obj.id= updatedValue;
        },
        set_obj_title: function (updatedValue) {
            obj.title= updatedValue;
        },
        set_obj_description: function (updatedValue) {
            obj.description= updatedValue;
        },
        set_obj_voteCount: function (updatedValue) {
            obj.voteCount= updatedValue;
        },
        reset_obj: function () {
            obj = {};
        },
        get_targetId : function () {
            return targetId;
        },
        set_targetId: function (updatedValue) {
            targetId = updatedValue;
        },
        get_elCount : function () {
            return elCount;
        },
        set_elCount : function (updatedValue) {
            elCount = updatedValue
        },
        get_commentVal : function () {
            return commentVal;
        },
        set_commentVal : function (updatedValue) {
            commentVal = updatedValue
        },
        get_unitId : function () {
            return unitId;
        },
        set_unitId : function (updatedValue) {
            unitId = updatedValue
        },
        get_commentObj: function () {
            return commentObj;
        },
        set_commentObj_comment: function (updatedValue) {
            commentObj.comment= updatedValue;
        },
        set_commentObj_parrentid: function (updatedValue) {
            commentObj.parrentid= updatedValue;
        },
        get_targetRepDiv : function () {
            return targetRepDiv;
        },
        set_targetRepDiv : function (updatedValue) {
            targetRepDiv = updatedValue
        }
    });
});