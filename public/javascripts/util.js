// // Initialize common variable
// define([], function () {
//     class Util {
//
//         constructor() {
//             this.reddit = document.querySelector('#reddit');
//             this.elTopSection = this.reddit.querySelector('.top-section');
//             this.elButtonPost = this.elTopSection.querySelector('.post');
//             this.elUnitWrap = this.reddit.querySelector('.unit-wrap');
//
//             this.obj = {};
//             this.elTarget = null;
//             this.elCount = 0;
//             this.commentVal = null;
//             this.commentObj = {};
//             this.targetRepDiv = null;
//             this.replySpanDom = null;
//             this.targetId;
//             this.unitId;
//         }
//     }
//
//     var myUtil = new Util();
//
//     return {
//         myUtil: myUtil
//     }
// });

define([
    "dojo/_base/declare",
    "dijit/_Widget"
], function (declare, _Widget) {
    return declare([_Widget], {
        reddit: document.querySelector('#reddit'),
        elTopSection: reddit.querySelector('.top-section'),
        elButtonPost: reddit.querySelector('.post'),
        elUnitWrap: reddit.querySelector('.unit-wrap'),
        obj: {},
        elTarget: null,
        elCount: 0,
        commentVal: null,
        commentObj: {},
        targetRepDiv: null,
        replySpanDom: null,
        targetId: null,
        unitId: null
    });

});