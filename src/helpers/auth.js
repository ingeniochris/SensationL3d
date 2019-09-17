const Auth = {};

Auth.ensureAuthentication = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Porfavor Inicie Sesión");
  res.redirect("/users/login");
};

Auth.forwardAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/colors/add");
};

module.exports = Auth;
