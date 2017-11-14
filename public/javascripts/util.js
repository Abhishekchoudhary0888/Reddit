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
    var util = declare([_Widget], {
        reddit: document.querySelector('#reddit'),
        elTopSection: "top-section",
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
        unitId: null,
        persistValueToDB: function (chk) {

            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            if (chk == 'post') {
                database.ref('Post/' + util.targetId).set(
                    {
                        title: util.obj.title,
                        description: util.obj.description,
                        id: util.targetId,
                        voteCount: util.obj.voteCount
                    });
            }
        }
    });

    return new util();
});