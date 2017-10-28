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
                        } else if( dom.classList.contains('comment-unit')){
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
                var outerDiv = document.createElement('div');
                outerDiv.classList.add('reply-comment-box');

                var elTextBox = document.createElement('textarea');
                outerDiv.appendChild(elTextBox);

                var elSave = document.createElement('span');
                elSave.classList.add('save-comment');
                elSave.innerHTML = 'Save';
                outerDiv.appendChild(elSave);

                var elCancel = document.createElement('span');
                elCancel.classList.add('cancel-comment');
                elCancel.innerHTML = 'Cancel';
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
                var elVote = el.parentElement.querySelector('.vote');
                this.targetId = elVote.parentElement.parentElement.id;


                this.elCount = eval(elVote.innerHTML) + vote;
                elVote.innerHTML = this.elCount;

                this.persistValueToDB('count');
            }

            createCommentUnitFn(value) {
                var commentUnit = document.createElement('div');
                commentUnit.classList.add('comment-unit');
                commentUnit.innerHTML = value;
                commentUnit.id = Date.now() + Math.round(Math.random());

                var elReply = document.createElement('span');
                elReply.innerHTML = 'Reply';
                elReply.classList.add('reply-comment');
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
                            id: this.targetId
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

                if (title.value) {
                    this.elUnitWrap.appendChild(this.createPostFn());
                    this.persistValueToDB('post');
                    // Resetting the values
                    title.value = '';
                    description.value = '';
                    this.obj = {};
                }
            }

            createPostFn() {
                var unit = document.createElement('div');
                unit.classList.add('unit');
                this.targetId = Date.now() + Math.round(Math.random());
                this.obj.id = this.targetId;
                unit.id = this.targetId;

                /* voteBlock */
                var voteBlock = document.createElement('div');
                voteBlock.classList.add('vote-block');

                var spanUpVote = document.createElement('span');
                spanUpVote.classList.add('upvote');
                voteBlock.appendChild(spanUpVote);

                var spanVote = document.createElement('span');
                spanVote.classList.add('vote');
                spanVote.innerHTML = '0';
                voteBlock.appendChild(spanVote);

                var spanDownVote = document.createElement('span');
                spanDownVote.classList.add('downvote');
                voteBlock.appendChild(spanDownVote);

                /* voteMsg */
                var voteMsg = document.createElement('div');
                voteMsg.classList.add('vote-msg');

                var pTitle = document.createElement('p');
                pTitle.classList.add('title');
                pTitle.innerHTML = this.obj.title;
                voteMsg.appendChild(pTitle);


                var pDescription = document.createElement('p');
                pDescription.classList.add('description');
                pDescription.innerHTML = this.obj.description;
                voteMsg.appendChild(pDescription);

                var commentTxt = document.createElement('div');
                commentTxt.classList.add('comment-txt');
                commentTxt.innerHTML = "Comment section below";
                voteMsg.appendChild(commentTxt);

                var commentBox = document.createElement('textarea');
                commentBox.classList.add('comment-box');
                voteMsg.appendChild(commentBox);

                var elSaveBtn = document.createElement('span');
                elSaveBtn.classList.add('save-btn');
                elSaveBtn.innerHTML = 'Save';
                voteMsg.appendChild(elSaveBtn);


                var allComments = document.createElement('div');
                allComments.classList.add('all-comments');
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


