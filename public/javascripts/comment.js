define(['javascripts/firebaseDB.js', 'javascripts/util.js'], function (config, util) {
    class Comment1 {
        constructor() {
            this.attachEvent();
        }

        attachEvent() {
            util.myUtil.elUnitWrap.addEventListener('click', this.findClick.bind(this));
        }

        findClick(evt) {
            util.myUtil.elTarget = evt.target;

            if (util.myUtil.elTarget.classList.contains('save-btn')) {
                this.addCommentBlock(util.myUtil.elTarget);
            }

            if (util.myUtil.elTarget.classList.contains('reply-comment')) {
                this.replyCommentsFn(util.myUtil.elTarget);
            }

            if (util.myUtil.elTarget.classList.contains('save-comment')) {
                this.updateCommentOnReply(util.myUtil.elTarget);
            }

            if (util.myUtil.elTarget.classList.contains('cancel-comment')) {
                this.cancelCommentBlockFn(util.myUtil.elTarget);
            }
        }

        addCommentBlock(evt) {
            var ancestor = this.findAncestor(evt, 'unit');
            var elCommentBox = evt.parentElement.querySelector('.comment-box');
            util.myUtil.commentVal = elCommentBox.value;

            if (elCommentBox.value) {
                var commentUnit = this.createCommentUnitFn(util.myUtil.commentVal);

                elCommentBox.value = '';

                var elAllComments = evt.parentElement.querySelector('.all-comments');
                elAllComments.appendChild(commentUnit);

                util.myUtil.unitId = commentUnit.id;
                util.myUtil.targetId = ancestor.id;
                util.myUtil.commentObj.comment = util.myUtil.commentVal;
                util.myUtil.commentObj.parrentid = evt.parentElement.parentElement.id;

                this.persistValueToDB('commentVal');
            }
        }

        persistValueToDB(chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();
            if (chk == 'commentVal') {
                database.ref('Post/' + util.myUtil.targetId + '/comments/' + util.myUtil.unitId).update({
                    id: util.myUtil.unitId,
                    comment: util.myUtil.commentObj.comment,
                    parentId: util.myUtil.commentObj.parrentid
                });
            }
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
            util.myUtil.targetId = this.findAncestor(el, 'unit').id;
            var outerDiv = util.myUtil.targetRepDiv = el.parentElement;
            var commentBlock = this.createCommentBlock();

            outerDiv.appendChild(commentBlock);
        }

        cancelCommentBlockFn(el) {
            el.parentElement.remove();
        }


        updateCommentOnReply(el) {
            var ancestor = this.findAncestor(el, 'unit');

            var outerWrap = el.parentElement.parentElement;
            var textAreaValue = outerWrap.querySelector('textarea').value;

            if (textAreaValue) {
                var commentBlock = this.createCommentUnitFn(textAreaValue);
                outerWrap.appendChild(commentBlock);
                el.parentElement.remove();
               // util.myUtil.replySpanDom.remove();
            }

            util.myUtil.commentObj.comment = textAreaValue;
            util.myUtil.commentObj.parrentid = util.myUtil.targetRepDiv.id;
            util.myUtil.unitId = commentBlock.id;
            util.myUtil.targetId = ancestor.id;

            this.persistValueToDB('commentVal');
        }

        createCommentUnitFn(value) {
            var commentUnit = this.createDomElementFunction('div', 'comment-unit', Date.now() + Math.round(Math.random()), value);

            var elReply = this.createDomElementFunction('span', 'reply-comment', '', 'Reply');
            commentUnit.appendChild(elReply);

            return commentUnit;
        }

        createDomElementFunction(el, elClassName, elIdName, elText) {
            var elDom = document.createElement(el);

            elClassName ? elDom.classList.add(elClassName) : '';
            elIdName ? (elDom.id = elIdName) : '';
            elText ? (elDom.innerHTML = elText) : '';

            return elDom;
        }


    }

    var mycomment = new Comment1();

    return {
        mycomment: mycomment
    }
});

