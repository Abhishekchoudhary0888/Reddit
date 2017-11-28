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



define(['javascripts/firebaseDB.js', 'javascripts/comment.js', 'javascripts/util.js'], function (config, commentObject, util) {
    class Post {
        constructor() {
            this.attachEvent();
            this.populateAllPost();
        }

        attachEvent() {
            util.myUtil.elUnitWrap.addEventListener('click', this.findClick.bind(this));
        }

        findClick(evt) {
            util.myUtil.elTarget = evt.target;

            if (util.myUtil.elTarget.classList.contains('upvote')) {
                this.updateVoteValueFn(util.myUtil.elTarget, 1);
            }

            if (util.myUtil.elTarget.classList.contains('downvote')) {
                this.updateVoteValueFn(util.myUtil.elTarget, -1);
            }
        }

        populateAllPost() {
            var that = this,
                storeObj = [];

            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();
            var postRef = database.ref('Post');

            postRef.once('value').then(function (obj) {
                var content = obj.val();

                if (content) {
                    var keys = Object.keys(content);

                    for (var i = 0; i < keys.length; i++) {
                        var k = content[keys[i]];
                        storeObj.push(k);
                    }
                    storeObj = that.sortStoreObj(storeObj);

                    for (var i = 0; i < storeObj.length; i++) {
                        var domUnitPost = document.createElement('div');
                        domUnitPost.innerHTML = that.createPostFn();
                        domUnitPost = domUnitPost.getElementsByTagName('div')[0];

                        domUnitPost.querySelector('.vote').innerHTML = storeObj[i].voteCount ? storeObj[i].voteCount : 0;
                        domUnitPost.id = storeObj[i].id;
                        domUnitPost.querySelector('.title').innerHTML = storeObj[i].title;
                        domUnitPost.querySelector('.description').innerHTML = storeObj[i].description;

                        util.myUtil.elUnitWrap.appendChild(domUnitPost); // Create post

                        // For comments
                        if (storeObj[i].comments) {
                            var commentObj = Object.keys(storeObj[i].comments);
                            for (var j = 0; j < commentObj.length; j++) {
                                var tempObj = storeObj[i].comments[commentObj[j]];

                                var dom = document.querySelector('[id="' + tempObj.parentId + '"]');

                                if (dom.classList.contains('unit')) {
                                    var allComments = domUnitPost.querySelector('.all-comments');
                                    var commentUnit = commentObject.mycomment.createCommentUnitFn(tempObj.comment);
                                    commentUnit.id = tempObj.id;
                                    allComments.appendChild(commentUnit);
                                } else if (dom.classList.contains('comment-unit')) {
                                    var commentUnit = commentObject.mycomment.createCommentUnitFn(tempObj.comment);
                                    commentUnit.id = tempObj.id;
                                    dom.appendChild(commentUnit);
                                }
                            }
                        }
                    }
                }
            });
        }

        sortStoreObj(storeObj) {
            var obj = [];
            for (var i = 0; i < storeObj.length; i++) {
                obj.push(storeObj[i]);
            }

            for (var i = 0; i < obj.length; i++) {
                for (var j = i + 1; j < obj.length; j++) {
                    if (obj[i].voteCount < obj[j].voteCount) {
                        var d = obj[j];
                        obj[j] = obj[i];
                        obj[i] = d;
                    }
                }
            }
            return obj;
        }

        persistValueToDB(chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            if (chk == 'count') {
                database.ref('Post/' + util.myUtil.targetId).update({
                    voteCount: util.myUtil.elCount
                });
            }
        }

        createPostFn() {
            util.myUtil.targetId = Date.now() + Math.round(Math.random());
            util.myUtil.obj.id = util.myUtil.targetId;

            var obj = {
                id: util.myUtil.obj.id,
                vote: 0,
                title: util.myUtil.obj.title,
                description: util.myUtil.obj.description
            };

            var template = document.getElementById('listContainer').innerHTML;
            var output = Mustache.render(template, obj);

            return output;
        }

        updateVoteValueFn(el, vote) {
            var elVote = el.parentElement.querySelector('.vote'),
                parentDiv = elVote.parentElement.parentElement;

            if (!parentDiv.classList.contains('voted')) {
                parentDiv.classList.add('voted');
                util.myUtil.targetId = parentDiv.id;

                util.myUtil.elCount = eval(elVote.innerHTML) + vote;
                elVote.innerHTML = util.myUtil.elCount;

                this.persistValueToDB('count');
            }
        }
    }

    var mypost = new Post();
    return {
        mypost: mypost
    }
})
;
