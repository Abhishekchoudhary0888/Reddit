define(['javascripts/firebaseDB.js', 'javascripts/post.js'], function (config, mypost) {

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
                database.ref('Post/' + mypost.mypost.targetId).set(
                    {
                        title: mypost.mypost.obj.title,
                        description: mypost.mypost.obj.description,
                        id: mypost.mypost.targetId,
                        voteCount: mypost.mypost.obj.voteCount
                    });
            }
        }

        postBtnClickListener() {
            var title = this.elTopSection.querySelector('.input-title'),
                description = this.elTopSection.querySelector('.textarea-msg');

            mypost.mypost.obj.title = title.value;
            mypost.mypost.obj.description = description.value;
            mypost.mypost.obj.voteCount = 0;

            if (title.value) {
                var domUnitPost = document.createElement('div');
                domUnitPost.innerHTML = mypost.mypost.createPostFn();
                domUnitPost = domUnitPost.getElementsByTagName('div')[0];


                this.elUnitWrap.appendChild(domUnitPost);
                this.persistValueToDB('post');
                // Resetting the values
                title.value = '';
                description.value = '';
                mypost.mypost.obj = {};
            }
        }
    }

    var RedditCons = Reddit;

    return {
        reddit: RedditCons
    }

});


