define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/TopSection.ejs",
    "./util",
    "./firebaseDB",
    "./PostUnit",
    "./CommentUnit"
], function (declare, _WidgetBase, _Templated, TopSection, util, config, PostUnit, CommentUnit) {

    var redditWidget = declare([_WidgetBase, _Templated], {
        templateString: TopSection,

        postbtnClicked: function () {
            utilBase = new util();

            utilBase.set_obj_title(this.inputTitle.value);
            utilBase.set_obj_description(this.textareaMsg.value);
            utilBase.set_obj_voteCount(0);

            if (this.inputTitle.value) {
                var post = new PostUnit();

                var domUnitPost = document.createElement('div');
                post.placeAt(domUnitPost);
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];

                this.unitWrap.append(domUnitPost);

                this.persistValueToDB('post');

                // Resetting the values
                this.inputTitle.value = '';
                this.textareaMsg.value = '';
                utilBase.reset_obj();
            }
        },

        populateAllPost: function () {
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

                        var post = new PostUnit(),
                            domUnitPost = document.createElement('div');

                        post.placeAt(domUnitPost);
                        domUnitPost = domUnitPost.getElementsByTagName('div')[0];


                        post.unit.dataset.id = storeObj[i].id;
                        post.vote.innerText = storeObj[i].voteCount ? storeObj[i].voteCount : 0;
                        post.title.innerText = storeObj[i].title;
                        post.description.innerText = storeObj[i].description;

                        that.unitWrap.append(domUnitPost); // Create post

                        if (storeObj[i].comments) {
                            var commentObj = Object.keys(storeObj[i].comments);
                            for (var j = 0; j < commentObj.length; j++) {
                                var tempObj = storeObj[i].comments[commentObj[j]];

                                var dom = document.querySelector('[data-id="' + tempObj.parentId + '"]');

                                if (dom.classList.contains('unit')) {
                                    var allComments = domUnitPost.querySelector('.all-comments');
                                    var commentUnit = new CommentUnit({value: tempObj.comment});
                                    //var commentUnit = commentObject.mycomment.createCommentUnitFn(tempObj.comment);
                                    commentUnit.commentUnitNode.dataset.id= tempObj.id;
                                    commentUnit.placeAt(allComments);
                                    //commentUnit.id = tempObj.id;

                                    //allComments.appendChild(commentUnit);
                                } else if (dom.classList.contains('comment-unit')) {
                                    var commentUnit = new CommentUnit({value: tempObj.comment});
                                    commentUnit.commentUnitNode.dataset.id= tempObj.id;
                                    commentUnit.placeAt(dom);
                                    //var commentUnit = commentObject.mycomment.createCommentUnitFn(tempObj.comment);
                                    // commentUnit.id = tempObj.id;
                                    // dom.appendChild(commentUnit);
                                }
                            }
                        }
                    }
                }
            });
        },

        sortStoreObj: function (storeObj) {
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
        },


        persistValueToDB: function (chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            utilBase = new util();

            if (chk == 'post') {
                database.ref('Post/' + utilBase.get_targetId()).set(
                    {
                        title: utilBase.get_obj().title,
                        description: utilBase.get_obj().description,
                        id: utilBase.get_targetId(),
                        voteCount: utilBase.get_obj().voteCount
                    });
            }
        },
        postCreate: function () {
            this.populateAllPost();
            this.inherited(arguments);
        }
    });

    new redditWidget().placeAt(document.querySelector('#reddit'));
});






















