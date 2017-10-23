
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDi3h7YDd1kCRTp4iKDfInqGeUUT7cUl5E",
    authDomain: "login-7617e.firebaseapp.com",
    databaseURL: "https://login-7617e.firebaseio.com",
    projectId: "login-7617e",
    storageBucket: "login-7617e.appspot.com",
    messagingSenderId: "870821907151"
};
// firebase.initializeApp(config);
//
// var database = firebase.database();
//var loginRef= database.ref('loginDetails');

//
// var data = {
//     name: 'abhi',
//     age: 29
// };
//
//
// loginRef.push(data);
//
// loginRef.on('value', function(obj){
//
//     var content = obj.val();
//     var keys = Object.keys(content);
//
//     for(var i=0; i< keys.length; i++){
//         var  k = content[keys[i]];
//         console.log(k.name, k.age);
//     }
// });

define(function(){
    return {
        config : config
    };
});
