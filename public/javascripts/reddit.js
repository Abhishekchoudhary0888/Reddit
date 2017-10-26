require(['javascripts/firebaseDB.js'], function (config) {

    (function () {
        'use strict'

        class Reddit {
            constructor() {
                this.reddit = document.querySelector('#reddit');
                this.elTopSection = this.reddit.querySelector('.top-section');
                this.elButtonPost = this.elTopSection.querySelector('.post');
                this.elUnitWrap = this.reddit.querySelector('.unit-wrap');

                this.elUpVote = this.elUnitWrap.querySelector('.upvote');
                this.elDownVote = this.elUnitWrap.querySelector('.downvote');

                this.obj = {};
                this.elTarget = null;

                this.targetId;
                this.attachEvents();
            }

            attachEvents() {
                this.elButtonPost.addEventListener('click', this.postBtnClickListener.bind(this));
                this.elUnitWrap.addEventListener('click', this.findClick.bind(this));
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
                    this.updateCommentBlock(this.elTarget);
                }

            }

            updateVoteValueFn(el, vote) {
                var elVote = el.parentElement.querySelector('.vote');
                elVote.innerHTML = eval(elVote.innerHTML) + vote;
            }

            updateCommentBlock(evt) {
                var elCommentBox = evt.parentElement.querySelector('.comment-box'),
                    value = elCommentBox.value;

                var commentUnit = document.createElement('div');
                commentUnit.classList.add('comment-unit');
                commentUnit.innerHTML = value;

                elCommentBox.value = '';

                var elAllComments = evt.parentElement.querySelector('.all-comments');
                elAllComments.appendChild(commentUnit);
            }

            persistNewPostValue() {
                var title = this.elTopSection.querySelector('.input-title'),
                    description = this.elTopSection.querySelector('.textarea-msg');

                this.obj.title = title.value;
                this.obj.description = description.value;

                // Resetting the values
                title.value = '';
                description.value = '';
            }

            persistValueToDB() {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config.config);
                }

                var database = firebase.database();
                // var postUnitDetailsRef = database.ref('PostUnitDetails');
                //
                //
                // postUnitDetailsRef.push(this.obj, function () {
                //     this.obj = {};
                // });

                // database.ref('Post/' + 3435).set(
                // {title: "ss", description: " ssss", id: 1509012477229}, function () {
                //     this.obj = {};
                // });

                //To update
                // database.ref('Post/' + 3435).update({ title: "New trainer" });


            }

            postBtnClickListener() {
                this.persistNewPostValue();
                this.elUnitWrap.appendChild(this.createPostFn());

                this.persistValueToDB();
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


