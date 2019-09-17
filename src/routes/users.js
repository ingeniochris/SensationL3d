const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Recaptcha = require('express-recaptcha').RecaptchaV3;

const recaptcha = new Recaptcha(process.env.SITE_KEY, process.env.SECRET_KEY_RECAPTCHA ,{callback:'cb'});

const { forwardAuthenticated  } = require('../helpers/auth');

router.get('/login', forwardAuthenticated , (req, res) => {
  res.render('users/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/colors/add',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// REGISTER
router.get('/register', forwardAuthenticated ,recaptcha.middleware.render, (req, res) => {
  res.render('users/register');
});

router.post('/register',recaptcha.middleware.verify, async (req, res) => {
  if (!req.recaptcha.error) {
  const {name, password} = req.body;  
  let errors = [];
  if(name.length<=0){
    errors.push({text: 'Ingresa un Nombre porfavor'})
  }
  if(password.length<=0){
    errors.push({text: 'Ingresa un Password porfavor'})
  }
  if (name.length < 4) {
    errors.push({text: 'El nombre debe tener por lo menos 4 caracteres.'})
  }
 
  if (password.length < 4) {
    errors.push({text: 'El password debe tener por lo menos 4 caracteres.'})
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      password: req.body.password
      
    });
  } else {
  
    let user = await User.findOne({name: req.body.name});
    if (user) {
      req.flash('error_msg', 'El nombre ya esta registrado');
      res.redirect('/users/login');
    } else {
      const newUser = new User({
        name: req.body.name,
        password: req.body.password
      });

      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      await newUser.save();
      req.flash('success_msg', 'Usuario registrado ahora puedes inicia sesion');
      res.redirect('/users/login');
    }
  }
} else {
  req.flash("error_msg", "Por favor seleccione RECAPTCHA ");
  res.redirect("back");
}
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Sesion finalizada');
  res.redirect('/users/login');
});

module.exports = router;
