// require(['javascripts/reddit.js'], function (reddit) {
//
//    //new reddit.reddit();
//
// });

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Templated",
    "dojo/text!./template/topsection.ejs",
    "./util"
], function (declare, _WidgetBase, _Templated, TopSectionTemplate, util) {

    var postWidget = declare([_WidgetBase, _Templated], {
        templateString: TopSectionTemplate
    });
    // var widgetClass = declare([_WidgetBase, _Templated], {
    //     templateString: buttonTemplate,
    //     onClicked: function () {
    //         var widget = new MyScript();
    //         widget.placeAt(this.bottomBlock);
    //     }
    // });

     new postWidget().placeAt(document.querySelector('#reddit'));
});






















