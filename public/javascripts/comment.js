    // class Comment1 {
    //     constructor() {
    //         this.reddit = document.querySelector('#reddit');
    //         this.elTopSection = this.reddit.querySelector('.top-section');
    //         this.elButtonPost = this.elTopSection.querySelector('.post');
    //         this.elUnitWrap = this.reddit.querySelector('.unit-wrap');
    //
    //         this.obj = {};
    //         this.elTarget = null;
    //         this.elCount = 0;
    //         this.commentVal = null;
    //         this.commentObj = {};
    //         this.targetRepDiv = null;
    //         this.replySpanDom = null;
    //         this.targetId;
    //         this.unitId;
    //
    //         this.attachEvent();
    //     }
    //
    //     attachEvent() {
    //         console.log('ss');
    //         this.elUnitWrap.addEventListener('click', this.findClick.bind(this));
    //     }
    //
    //     findClick(evt) {
    //         this.elTarget = evt.target;
    //
    //         if (this.elTarget.classList.contains('save-btn')) {
    //             this.addCommentBlock(this.elTarget);
    //         }
    //
    //         if (this.elTarget.classList.contains('reply-comment')) {
    //             this.replyCommentsFn(this.elTarget);
    //         }
    //
    //         if (this.elTarget.classList.contains('save-comment')) {
    //             this.updateCommentOnReply(this.elTarget);
    //         }
    //
    //         if (this.elTarget.classList.contains('cancel-comment')) {
    //             this.cancelCommentBlockFn(this.elTarget);
    //         }
    //     }
    //
    //     createCommentUnitFn(value) {
    //         var commentUnit = this.createDomElementFunction('div', 'comment-unit', Date.now() + Math.round(Math.random()), value);
    //
    //         var elReply = this.createDomElementFunction('span', 'reply-comment', '', 'Reply');
    //         commentUnit.appendChild(elReply);
    //
    //         return commentUnit;
    //     }
    //
    //
    //     addCommentBlock(evt) {
    //         var ancestor = this.findAncestor(evt, 'unit');
    //         var elCommentBox = evt.parentElement.querySelector('.comment-box');
    //         this.commentVal = elCommentBox.value;
    //
    //         if (elCommentBox.value) {
    //             var commentUnit = this.createCommentUnitFn(this.commentVal);
    //
    //             elCommentBox.value = '';
    //
    //             var elAllComments = evt.parentElement.querySelector('.all-comments');
    //             elAllComments.appendChild(commentUnit);
    //
    //             this.unitId = commentUnit.id;
    //             this.targetId = ancestor.id;
    //             this.commentObj.comment = this.commentVal;
    //             this.commentObj.parrentid = evt.parentElement.parentElement.id;
    //
    //             this.persistValueToDB('commentVal');
    //         }
    //     }
    //
    //
    //     createDomElementFunction(el, elClassName, elIdName, elText) {
    //         var elDom = document.createElement(el);
    //
    //         elClassName ? elDom.classList.add(elClassName) : '';
    //         elIdName ? (elDom.id = elIdName) : '';
    //         elText ? (elDom.innerHTML = elText) : '';
    //
    //         return elDom;
    //     }
    //
    //
    //     updateCommentOnReply(el) {
    //         var ancestor = this.findAncestor(el, 'unit');
    //
    //         var outerWrap = el.parentElement.parentElement;
    //         var textAreaValue = outerWrap.querySelector('textarea').value;
    //
    //         if (textAreaValue) {
    //             var commentBlock = this.createCommentUnitFn(textAreaValue);
    //             outerWrap.appendChild(commentBlock);
    //             el.parentElement.remove();
    //             this.replySpanDom.remove();
    //         }
    //
    //         this.commentObj.comment = textAreaValue;
    //         this.commentObj.parrentid = this.targetRepDiv.id;
    //         this.unitId = commentBlock.id;
    //         this.targetId = ancestor.id;
    //
    //         this.persistValueToDB('commentVal');
    //     }
    //
    //     cancelCommentBlockFn(el) {
    //         el.parentElement.remove();
    //     }
    //
    //     createCommentBlock() {
    //         var outerDiv = this.createDomElementFunction('div', 'reply-comment-box');
    //
    //         var elTextBox = this.createDomElementFunction('textarea');
    //         outerDiv.appendChild(elTextBox);
    //
    //         var elSave = this.createDomElementFunction('span', 'save-comment', '', 'Save');
    //         outerDiv.appendChild(elSave);
    //
    //         var elCancel = this.createDomElementFunction('span', 'cancel-comment', '', 'Cancel');
    //         outerDiv.appendChild(elCancel);
    //
    //         return outerDiv;
    //     }
    //
    //
    //     findAncestor(el, cls) {
    //         while ((el = el.parentElement) && !el.classList.contains(cls));
    //         return el;
    //     }
    //
    //     replyCommentsFn(el) {
    //         this.replySpanDom = el;
    //         this.targetId = this.findAncestor(el, 'unit').id;
    //         var outerDiv = this.targetRepDiv = el.parentElement;
    //         var commentBlock = this.createCommentBlock();
    //
    //         outerDiv.appendChild(commentBlock);
    //     }
    //
    //     persistValueToDB(chk) {
    //         if (!firebase.apps.length) {
    //             firebase.initializeApp(config.config);
    //         }
    //
    //         var database = firebase.database();
    //
    //         if (chk == 'post') {
    //             database.ref('Post/' + this.targetId).set(
    //                 {
    //                     title: this.obj.title,
    //                     description: this.obj.description,
    //                     id: this.targetId,
    //                     voteCount: this.obj.voteCount
    //                 });
    //         } else if (chk == 'count') {
    //             database.ref('Post/' + this.targetId).update({
    //                 voteCount: this.elCount
    //             });
    //         } else if (chk == 'commentVal') {
    //             database.ref('Post/' + this.targetId + '/comments/' + this.unitId).update({
    //                 id: this.unitId,
    //                 comment: this.commentObj.comment,
    //                 parentId: this.commentObj.parrentid
    //             });
    //         }
    //     }
    // }
    //
    // var mycomment = new Comment1();
    //
