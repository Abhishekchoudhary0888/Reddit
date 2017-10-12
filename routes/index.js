var express = require('express');
var passport = require('passport');
var myIndex = require('../public/javascripts/login.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect("/login");
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
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

router.post('/login', function(req, res) {
  console.log('insideeeeee');
  if(myIndex.chkFn()){
    res.redirect("/");
  }
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}