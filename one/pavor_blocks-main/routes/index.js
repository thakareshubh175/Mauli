var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");

const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.get('/card', function(req, res, next) {
  res.render('card');
});
router.get('/basket', function(req, res, next) {
  res.render('Basket');
});
router.get('/Contempory', function(req, res, next) {
  res.render('Contempory');
});
router.get('/Dumbbell', function(req, res, next) {
  res.render('Dumbbell');
});
router.get('/Herringbone', function(req, res, next) {
  res.render('Herringbone');
});
router.get('/hexagonal', function(req, res, next) {
  res.render('hexagonal');
});
router.get('/milano', function(req, res, next) {
  res.render('milano');
});


router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});


router.get('/order',isLogged, async function(req, res, next) {
  const user =  await userModel.findOne({username:req.session.passport.user});
  res.render('order',{user});
});

router.post('/createpost',isLogged,upload.single("postimage") ,async function(req, res, next) {
  const user =  await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    phone:req.body.phone
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/");
});


router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email:req.body.email,
    name:req.body.fullname,
  })
  
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/order");
    })
  })
});

router.post('/login',passport.authenticate("local",{
  failureRedirect:"/login",
  successRedirect:"/order"

}) ,function(req, res, next) {
  res.render('index');
});

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


function isLogged(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
