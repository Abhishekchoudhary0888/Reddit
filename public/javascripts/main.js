define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/topsection.ejs",
    "./util",
    "./firebaseDB",
    "./createpost"
], function (declare, _WidgetBase, _Templated, TopSectionTemplate, util, config, createPost) {

    var redditWidget = declare([_WidgetBase, _Templated], {
        templateString: TopSectionTemplate,

        postbtnClicked: function () {
            utilBase = new util();

            utilBase.set_obj_title(this.inputTitle.value);
            utilBase.set_obj_description(this.textareaMsg.value);
            utilBase.set_obj_voteCount(0);

            if (this.inputTitle.value) {
                var post = new createPost();

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
        }
    });

    new redditWidget().placeAt(document.querySelector('#reddit'));
});






















