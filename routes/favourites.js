var express = require("express");
var passport = require("passport");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Favourite Routes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post("/:id/favourites", middleware.isLoggedIn, function(req,res){
    req.user.favourites.push(req.params.id);
    console.log("Added " + req.params.id + " to favourites");
    console.log(req.user.favourites);
    req.user.save();
    res.redirect("back");
});




module.exports = router;