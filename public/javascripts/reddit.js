// define(['javascripts/firebaseDB.js', 'javascripts/post.js', 'javascripts/util.js'], function (config, mypost, util) {
//
//     class Reddit {
//         constructor() {
//             this.attachEvents();
//         }
//
//         attachEvents() {
//             util.myUtil.elButtonPost.addEventListener('click', this.postBtnClickListener.bind(this));
//         }
//
//         persistValueToDB(chk) {
//             if (!firebase.apps.length) {
//                 firebase.initializeApp(config.config);
//             }
//
//             var database = firebase.database();
//
//             if (chk == 'post') {
//                 database.ref('Post/' + util.myUtil.targetId).set(
//                     {
//                         title: util.myUtil.obj.title,
//                         description: util.myUtil.obj.description,
//                         id: util.myUtil.targetId,
//                         voteCount: util.myUtil.obj.voteCount
//                     });
//             }
//         }
//
// postBtnClickListener()
// {
//     var title = util.myUtil.elTopSection.querySelector('.input-title'),
//         description = util.myUtil.elTopSection.querySelector('.textarea-msg');
//
//     util.myUtil.obj.title = title.value;
//     util.myUtil.obj.description = description.value;
//     util.myUtil.obj.voteCount = 0;
//
//     if (title.value) {
//         var domUnitPost = document.createElement('div');
//         domUnitPost.innerHTML = mypost.mypost.createPostFn();
//         domUnitPost = domUnitPost.getElementsByTagName('div')[0];
//
//
//         util.myUtil.elUnitWrap.appendChild(domUnitPost);
//         this.persistValueToDB('post');
//         // Resetting the values
//         title.value = '';
//         description.value = '';
//         util.myUtil.obj = {};
//     }
// }
// }
//
//     var RedditCons = Reddit;
//
//     return {
//         reddit: RedditCons
//     }
//
// });

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "./util"
], function (declare, _WidgetBase, util) {

    return declare([_WidgetBase], {
        postBtnClickListener: function () {
            alert('indise');
            var title = util.elTopSection.querySelector('.input-title'),
                description = util.elTopSection.querySelector('.textarea-msg');

            util.obj.title = title.value;
            util.obj.description = description.value;
            util.obj.voteCount = 0;

            if (title.value) {
                var domUnitPost = document.createElement('div');
               // domUnitPost.innerHTML = mypost.mypost.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];

                util.elUnitWrap.appendChild(domUnitPost);
                //this.persistValueToDB('post');
                // Resetting the values
                title.value = '';
                description.value = '';
                util.obj = {};
            }
        }
    });


});

