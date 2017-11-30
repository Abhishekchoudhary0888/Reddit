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


router.get('/logout', function(req, res) {
  res.render("/login");
});

router.get('/public/javascripts/createpost.js', function(req, res) {
  res.redirect("/login");
});
module.exports = router;

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/');
// }