define(['javascripts/firebaseDB.js', 'javascripts/post.js', 'javascripts/util.js'], function (config, mypost, util) {

    class Reddit {
        constructor() {
            this.reddit = document.querySelector('#reddit');
            this.elTopSection = this.reddit.querySelector('.top-section');
            this.elButtonPost = this.elTopSection.querySelector('.post');
            this.elUnitWrap = this.reddit.querySelector('.unit-wrap');

            this.attachEvents();
        }


        attachEvents() {
            this.elButtonPost.addEventListener('click', this.postBtnClickListener.bind(this));
        }

        persistValueToDB(chk) {
            if (!firebase.apps.length) {
                firebase.initializeApp(config.config);
            }

            var database = firebase.database();

            if (chk == 'post') {
                database.ref('Post/' + util.myUtil.targetId).set(
                    {
                        title: util.myUtil.obj.title,
                        description: util.myUtil.obj.description,
                        id: util.myUtil.targetId,
                        voteCount: util.myUtil.obj.voteCount
                    });
            }
        }

        postBtnClickListener() {
            var title = this.elTopSection.querySelector('.input-title'),
                description = this.elTopSection.querySelector('.textarea-msg');

            util.myUtil.obj.title = title.value;
            util.myUtil.obj.description = description.value;
            util.myUtil.obj.voteCount = 0;

            if (title.value) {
                var domUnitPost = document.createElement('div');
                domUnitPost.innerHTML = mypost.mypost.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];


                this.elUnitWrap.appendChild(domUnitPost);
                this.persistValueToDB('post');
                // Resetting the values
                title.value = '';
                description.value = '';
                util.myUtil.obj = {};
            }
        }
    }

    var RedditCons = Reddit;

    return {
        reddit: RedditCons
    }

});


