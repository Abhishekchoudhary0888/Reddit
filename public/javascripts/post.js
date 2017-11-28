define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/topsection.ejs",
    "./util",
    "./post"
], function (declare, _WidgetBase, _Templated, TopSectionTemplate, util, post) {

    var redditWidget = declare([_WidgetBase, _Templated], {
        templateString: TopSectionTemplate,

        postbtnClicked: function () {
            utilBase = new util();

            utilBase.set_obj_title(this.inputTitle.value);
            utilBase.set_obj_description(this.textareaMsg.value);
            utilBase.set_obj_voteCount(0);

            if (this.inputTitle.value) {
                var domUnitPost = document.createElement('div');
                // domUnitPost.innerHTML = mypost.mypost.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];

                this.unitWrap.append(domUnitPost);
                util.persistValueToDB('post');
                // Resetting the values
                inputTitle.value = '';
                textareaMsg.value = '';
                utilBase.reset_obj();
            }
        }
    });

    new redditWidget().placeAt(document.querySelector('#reddit'));
});
