define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/postsection.ejs",
    "./util"
], function (declare, _WidgetBase, _Templated, postSectionTemplate, util) {

    return declare([_WidgetBase, _Templated], {
        templateString: postSectionTemplate,
        
        upVoteClicked: function () {
            this.updateVote(1);
        },

        downVoteClicked: function () {
            this.updateVote(-1);
        },

        updateVote: function (val) {
            utilBase = new util();

            if (!this.unit.classList.contains('voted')) {
                this.unit.classList.add('voted');
                utilBase.set_targetId(this.unit.getAttribute('data-id'));

                utilBase.set_elCount(eval(this.vote.innerText) + val);
                this.vote.innerText = utilBase.get_elCount();
                this.persistValueToDB('count');
            }

        },

        persistValueToDB: function (chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            if (chk == 'count') {
                database.ref('Post/' + utilBase.get_targetId()).update({
                    voteCount: utilBase.get_elCount()
                });
            }
        },

        postCreate: function () {
            var id = Date.now() + Math.round(Math.random());

            utilBase = new util();

            utilBase.set_targetId(id);
            utilBase.set_obj_id(id);
            this.unit.dataset.id = id;
            this.vote.innerText = 0;
            this.title.innerText = utilBase.get_obj().title;
            this.description.innerText = utilBase.get_obj().description;

            this.inherited(arguments);
        }
    });
});
