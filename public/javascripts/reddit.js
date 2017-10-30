require(['javascripts/firebaseDB.js'], function (config) {

    (function () {
        'use strict'

        class Reddit {
            constructor() {
                this.reddit = document.querySelector('#reddit');
                this.elTopSection = this.reddit.querySelector('.top-section');
                this.elButtonPost = this.elTopSection.querySelector('.post');
                this.elUnitWrap = this.reddit.querySelector('.unit-wrap');

                this.obj = {};
                this.elTarget = null;
                this.elCount = 0;
                this.voteFlag = true;
                this.commentVal = null;
                this.commentObj = {};
                this.storeObj = [];
                this.targetRepDiv = null;
                this.replySpanDom = null;
                this.targetId;

                this.attachEvents();
                this.populateAllPost();
                this.populateAllComments();
            }

            attachEvents() {
                this.elButtonPost.addEventListener('click', this.postBtnClickListener.bind(this));
                this.elUnitWrap.addEventListener('click', this.findClick.bind(this));
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
                    var keys = Object.keys(content);

                    for (var i = 0; i < keys.length; i++) {
                        var k = content[keys[i]];
                        storeObj.push(k);
                    }

                    storeObj = that.sortStoreObj(storeObj);
                    for (var i = 0; i < storeObj.length; i++) {
                        var domUnitPost = that.createPostFn();
                        domUnitPost.querySelector('.vote').innerHTML = storeObj[i].voteCount ? storeObj[i].voteCount : 0;
                        domUnitPost.id = storeObj[i].id;
                        domUnitPost.querySelector('.title').innerHTML = storeObj[i].title;
                        domUnitPost.querySelector('.description').innerHTML = storeObj[i].description;

                        that.elUnitWrap.appendChild(domUnitPost); // Create post
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

            populateAllComments() {
                var that = this,
                    storeObj = [];

                if (!firebase.apps.length) {
                    firebase.initializeApp(config.config);
                }

                var database = firebase.database();
                var commentRef = database.ref('Comments');

                commentRef.once('value').then(function (obj) {
                    var content = obj.val();
                    var keys = Object.keys(content);

                    for (var i = 0; i < keys.length; i++) {
                        var k = content[keys[i]];
                        storeObj.push(k);
                    }

                    for (var i = 0; i < storeObj.length; i++) {
                        var dom = document.querySelector('[id="' + storeObj[i].parentId + '"]');
                        if (dom.classList.contains('unit')) {
                            var allComments = dom.querySelector('.all-comments');
                            var commentUnit = that.createCommentUnitFn(storeObj[i].comment);
                            commentUnit.id = keys[i];
                            allComments.appendChild(commentUnit);
                        } else if (dom.classList.contains('comment-unit')) {
                            var commentUnit = that.createCommentUnitFn(storeObj[i].comment);
                            commentUnit.id = keys[i];
                            dom.appendChild(commentUnit);
                        }
                    }
                });
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
                this.targetId = commentBlock.id;

                this.persistValueToDB('commentVal');
            }

            cancelCommentBlockFn(el) {
                el.parentElement.remove();
            }

            createCommentBlock() {
                var outerDiv = this.createDomElementFunction('div', 'reply-comment-box');

                var elTextBox = this.createDomElementFunction('textarea');
                outerDiv.appendChild(elTextBox);

                var elSave = this.createDomElementFunction('span','save-comment','','Save');
                outerDiv.appendChild(elSave);

                var elCancel = this.createDomElementFunction('span','cancel-comment','','Cancel');
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
                var commentUnit = this.createDomElementFunction('div','comment-unit', Date.now() + Math.round(Math.random()), value);

                var elReply = this.createDomElementFunction('span','reply-comment', '', 'Reply');
                commentUnit.appendChild(elReply);

                return commentUnit;
            }

            addCommentBlock(evt) {
                var elCommentBox = evt.parentElement.querySelector('.comment-box');
                this.commentVal = elCommentBox.value;

                if (elCommentBox.value) {
                    var commentUnit = this.createCommentUnitFn(this.commentVal);

                    elCommentBox.value = '';

                    var elAllComments = evt.parentElement.querySelector('.all-comments');
                    elAllComments.appendChild(commentUnit);

                    this.targetId = commentUnit.id;
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
                    database.ref('Comments/' + this.targetId).update({

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
                    this.elUnitWrap.appendChild(this.createPostFn());
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
                var unit = this.createDomElementFunction('div', 'unit', this.targetId);

                /* voteBlock */
                var voteBlock = this.createDomElementFunction('div', 'vote-block');

                var spanUpVote = this.createDomElementFunction('span', 'upvote');
                voteBlock.appendChild(spanUpVote);


                var spanVote = this.createDomElementFunction('span', 'vote', '', '0');
                voteBlock.appendChild(spanVote);


                var spanDownVote = this.createDomElementFunction('span', 'downvote');
                voteBlock.appendChild(spanDownVote);

                /* voteMsg */
                var voteMsg = this.createDomElementFunction('div', 'vote-msg');

                var pTitle = this.createDomElementFunction('p', 'title', '', this.obj.title);
                voteMsg.appendChild(pTitle);

                var pDescription = this.createDomElementFunction('p', 'description', '', this.obj.description);
                voteMsg.appendChild(pDescription);

                var commentTxt = this.createDomElementFunction('div', 'comment-txt', '', 'Comment section below');
                voteMsg.appendChild(commentTxt);

                var commentBox = this.createDomElementFunction('textarea', 'comment-box');
                voteMsg.appendChild(commentBox);

                var elSaveBtn = this.createDomElementFunction('span', 'save-btn','','Save');
                voteMsg.appendChild(elSaveBtn);

                var allComments = this.createDomElementFunction('div', 'all-comments');
                voteMsg.appendChild(allComments);

                /* Append voteBlock  and voteMsg into Unit*/
                unit.appendChild(voteBlock);
                unit.appendChild(voteMsg);

                return unit;
            }
        }

        new Reddit();
    }());

});


