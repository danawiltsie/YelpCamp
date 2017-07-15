var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ++++++++++++++++++++++++++++
// AUTH ROUTES
// ++++++++++++++++++++++++++++

router.get("/register", function(req,res){
    res.render("auth/register");
});

router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

// ++++++++++++++++++++++++++++
// LOGIN ROUTES
// ++++++++++++++++++++++++++++

router.get("/login", function(req,res){
    res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), function(req,res){
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
});

// =============================================================================

module.exports = router;
