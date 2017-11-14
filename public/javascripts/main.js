define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/topsection.ejs",
    "./util"
], function (declare, _WidgetBase, _Templated, TopSectionTemplate, util) {

    var redditWidget = declare([_WidgetBase, _Templated], {
        templateString: TopSectionTemplate,

        postbtnClicked: function () {
            alert('indise');
            util.obj.title = this.inputTitle.value;
            util.obj.description = this.textareaMsg.value;
            util.obj.voteCount = 0;

            if (this.inputTitle.value) {
                var domUnitPost = document.createElement('div');
                // domUnitPost.innerHTML = mypost.mypost.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];

                this.unitWrap.append(domUnitPost);
                util.persistValueToDB('post');
                // Resetting the values
                inputTitle.value = '';
                textareaMsg.value = '';
                util.obj = {};
            }
        }
    });

    new redditWidget().placeAt(document.querySelector('#reddit'));
});






















