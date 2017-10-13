var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect("/login");
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs');
});

router.get('/home', function(req, res) {
  res.render('home.ejs');
});


// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/');
// });


// router.post('/signup', passport.authenticate('local-signup', {
//   successRedirect: '/profile',
//   failureRedirect: '/signup',
//   failureFlash: true,
// }));

// router.post('/login', function(req, res) {
//   console.log('insideeeeee');
//   if(myIndex.chkFn()){
//     res.redirect("/inde");
//   }
// });

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}