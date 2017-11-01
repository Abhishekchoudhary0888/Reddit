define(['javascripts/firebaseDB.js', 'javascripts/post.js'], function (config, mypost) {


    class Reddit {
        constructor() {
            this.reddit = document.querySelector('#reddit');
            this.elTopSection = this.reddit.querySelector('.top-section');
            this.elButtonPost = this.elTopSection.querySelector('.post');
            this.elUnitWrap = this.reddit.querySelector('.unit-wrap');

            this.obj = {};
            this.elTarget = null;
            this.elCount = 0;
            this.commentVal = null;
            this.commentObj = {};
            this.targetRepDiv = null;
            this.replySpanDom = null;
            this.targetId;
            this.unitId;

            this.attachEvents();
            this.populateAllPost();
        }

        attachEvents() {
            this.elButtonPost.addEventListener('click', this.postBtnClickListener.bind(this));
            this.elUnitWrap.addEventListener('click', this.findClick.bind(this));
        }

        postBtnClickListener() {
            var title = this.elTopSection.querySelector('.input-title'),
                description = this.elTopSection.querySelector('.textarea-msg');

            this.obj.title = title.value;
            this.obj.description = description.value;
            this.obj.voteCount = 0;

            if (title.value) {
                var domUnitPost = document.createElement('div');
                domUnitPost.innerHTML = this.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];


                this.elUnitWrap.appendChild(domUnitPost);
                this.persistValueToDB('post');
                // Resetting the values
                title.value = '';
                description.value = '';
                this.obj = {};
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

                        that.elUnitWrap.appendChild(domUnitPost); // Create post

                        // For comments
                        var commentObj = Object.keys(storeObj[i].comments);
                        for (var j = 0; j < commentObj.length; j++) {
                            var tempObj = storeObj[i].comments[commentObj[j]];

                            var dom = document.querySelector('[id="' + tempObj.parentId + '"]');

                            if (dom.classList.contains('unit')) {
                                var allComments = domUnitPost.querySelector('.all-comments');
                                var commentUnit = that.createCommentUnitFn(tempObj.comment);
                                commentUnit.id = tempObj.id;
                                allComments.appendChild(commentUnit);
                            } else if (dom.classList.contains('comment-unit')) {
                                var commentUnit = that.createCommentUnitFn(tempObj.comment);
                                commentUnit.id = tempObj.id;
                                dom.appendChild(commentUnit);
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

        findClick(evt) {
            this.elTarget = evt.target;

            if (this.elTarget.classList.contains('upvote')) {
                this.updateVoteValueFn(this.elTarget, 1);
            }

            if (this.elTarget.classList.contains('downvote')) {
                this.updateVoteValueFn(this.elTarget, -1);
            }

            if (this.elTarget.classList.contains('save-btn')) {
                this.addCommentBlock(this.elTarget);
            }

            if (this.elTarget.classList.contains('reply-comment')) {
                this.replyCommentsFn(this.elTarget);
            }

            if (this.elTarget.classList.contains('save-comment')) {
                this.updateCommentOnReply(this.elTarget);
            }

            if (this.elTarget.classList.contains('cancel-comment')) {
                this.cancelCommentBlockFn(this.elTarget);
            }
        }

        updateCommentOnReply(el) {
            var ancestor = this.findAncestor(el, 'unit');

            var outerWrap = el.parentElement.parentElement;
            var textAreaValue = outerWrap.querySelector('textarea').value;

            if (textAreaValue) {
                var commentBlock = this.createCommentUnitFn(textAreaValue);
                outerWrap.appendChild(commentBlock);
                el.parentElement.remove();
                this.replySpanDom.remove();
            }

            this.commentObj.comment = textAreaValue;
            this.commentObj.parrentid = this.targetRepDiv.id;
            this.unitId = commentBlock.id;
            this.targetId = ancestor.id;

            this.persistValueToDB('commentVal');
        }

        cancelCommentBlockFn(el) {
            el.parentElement.remove();
        }

        createCommentBlock() {
            var outerDiv = this.createDomElementFunction('div', 'reply-comment-box');

            var elTextBox = this.createDomElementFunction('textarea');
            outerDiv.appendChild(elTextBox);

            var elSave = this.createDomElementFunction('span', 'save-comment', '', 'Save');
            outerDiv.appendChild(elSave);

            var elCancel = this.createDomElementFunction('span', 'cancel-comment', '', 'Cancel');
            outerDiv.appendChild(elCancel);

            return outerDiv;
        }


        findAncestor(el, cls) {
            while ((el = el.parentElement) && !el.classList.contains(cls));
            return el;
        }

        replyCommentsFn(el) {
            this.replySpanDom = el;
            this.targetId = this.findAncestor(el, 'unit').id;
            var outerDiv = this.targetRepDiv = el.parentElement;
            var commentBlock = this.createCommentBlock();

            outerDiv.appendChild(commentBlock);
        }

        updateVoteValueFn(el, vote) {
            var elVote = el.parentElement.querySelector('.vote'),
                parentDiv = elVote.parentElement.parentElement;

            if (!parentDiv.classList.contains('voted')) {
                parentDiv.classList.add('voted');
                this.targetId = parentDiv.id;

                this.elCount = eval(elVote.innerHTML) + vote;
                elVote.innerHTML = this.elCount;

                this.persistValueToDB('count');
            }
        }

        createCommentUnitFn(value) {
            var commentUnit = this.createDomElementFunction('div', 'comment-unit', Date.now() + Math.round(Math.random()), value);

            var elReply = this.createDomElementFunction('span', 'reply-comment', '', 'Reply');
            commentUnit.appendChild(elReply);

            return commentUnit;
        }

        addCommentBlock(evt) {
            var ancestor = this.findAncestor(evt, 'unit');
            var elCommentBox = evt.parentElement.querySelector('.comment-box');
            this.commentVal = elCommentBox.value;

            if (elCommentBox.value) {
                var commentUnit = this.createCommentUnitFn(this.commentVal);

                elCommentBox.value = '';

                var elAllComments = evt.parentElement.querySelector('.all-comments');
                elAllComments.appendChild(commentUnit);

                this.unitId = commentUnit.id;
                this.targetId = ancestor.id;
                this.commentObj.comment = this.commentVal;
                this.commentObj.parrentid = evt.parentElement.parentElement.id;

                this.persistValueToDB('commentVal');
            }
        }

        persistValueToDB(chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            if (chk == 'post') {
                database.ref('Post/' + this.targetId).set(
                    {
                        title: this.obj.title,
                        description: this.obj.description,
                        id: this.targetId,
                        voteCount: this.obj.voteCount
                    });
            } else if (chk == 'count') {
                database.ref('Post/' + this.targetId).update({
                    voteCount: this.elCount
                });
            } else if (chk == 'commentVal') {
                database.ref('Post/' + this.targetId + '/comments/' + this.unitId).update({
                    id: this.unitId,
                    comment: this.commentObj.comment,
                    parentId: this.commentObj.parrentid
                });
            }
        }

        postBtnClickListener() {
            var title = this.elTopSection.querySelector('.input-title'),
                description = this.elTopSection.querySelector('.textarea-msg');

            this.obj.title = title.value;
            this.obj.description = description.value;
            this.obj.voteCount = 0;

            if (title.value) {
                var domUnitPost = document.createElement('div');
                domUnitPost.innerHTML = this.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];


                this.elUnitWrap.appendChild(domUnitPost);
                this.persistValueToDB('post');
                // Resetting the values
                title.value = '';
                description.value = '';
                this.obj = {};
            }
        }

        createDomElementFunction(el, elClassName, elIdName, elText) {
            var elDom = document.createElement(el);

            elClassName ? elDom.classList.add(elClassName) : '';
            elIdName ? (elDom.id = elIdName) : '';
            elText ? (elDom.innerHTML = elText) : '';

            return elDom;
        }

        createPostFn() {

            this.targetId = Date.now() + Math.round(Math.random());
            this.obj.id = this.targetId;

            var obj = {
                id: this.obj.id,
                vote: 0,
                title: this.obj.title,
                description: this.obj.description
            };

            var template = document.getElementById('listContainer').innerHTML;
            var output = Mustache.render(template, obj);

            return output;
        }
    }

    var RedditCons = Reddit;

    debugger;
    return {
        reddit: RedditCons
    }

});


