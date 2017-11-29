define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/postsection.ejs",
    "./util"
], function (declare, _WidgetBase, _Templated, postSectionTemplate, util) {

    return declare([_WidgetBase, _Templated], {
        templateString: postSectionTemplate,

        postCreate: function () {
            var id= Date.now() + Math.round(Math.random());

            utilBase = new util();

            utilBase.set_targetId(id);
            utilBase.set_obj_id(id);
            this.unit.dataset.id= id;
            this.vote= 0;
            this.title.innerText = utilBase.get_obj().title;
            this.description.innerText = utilBase.get_obj().description;

            this.inherited(arguments);
        }
    });
});
