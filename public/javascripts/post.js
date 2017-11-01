define([], function () {
    class Post1 {
        constructor() {
            this.attachEvent();
        }

        attachEvent() {
            console.log('ss');
        }
    }

    var mypost = new Post1();
    return {
        mypost: mypost
    }
});


