// Initialize Firebase
define([
    "dojo/_base/declare",
    "dijit/_Widget"
], function (declare, _Widget) {
    var config = declare([_Widget], {

        config: {
            apiKey: "AIzaSyDi3h7YDd1kCRTp4iKDfInqGeUUT7cUl5E",
            authDomain: "login-7617e.firebaseapp.com",
            databaseURL: "https://login-7617e.firebaseio.com",
            projectId: "login-7617e",
            storageBucket: "login-7617e.appspot.com",
            messagingSenderId: "870821907151"
        }
    });

    return new config();
});