// Initialize common variable
define([], function () {
    class Util {

        constructor() {
            this.obj = {};
            this.elTarget = null;
            this.elCount = 0;
            this.commentVal = null;
            this.commentObj = {};
            this.targetRepDiv = null;
            this.replySpanDom = null;
            this.targetId;
            this.unitId;
        }
    }

    var myUtil = new Util();
    return {
        myUtil: myUtil
    }
});

