var express = require("express");
var passport = require("passport");
var mongoose = require("mongoose");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Favourite Routes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// INDEX
router.get("/", middleware.isLoggedIn, function(req,res){
    if(req.user.favourites.length <= 0){
        res.render("favourites/index", {campgrounds: [], currentUser: req.user});
    } else {
    Campground.find({
    '_id': { $in: req.user.favourites }
}, function(err, favouriteCampgrounds){
        if(err){
            console.log("Error ENCOUNTERED!");
            req.flash("error", "Something went wrong; Please try again");
            res.redirect("back");
        } else {
            res.render("favourites/index", {campgrounds: favouriteCampgrounds, currentUser: req.user});
        }
    });
    }
});

// CREATE
router.post("/:id", middleware.isLoggedIn, function(req,res){
    req.user.favourites.push(req.params.id);
    req.user.save();
    req.flash("success", "Campground added to favourites");
    res.redirect("back");
});

// DESTROY
router.delete("/:id", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            var index = req.user.favourites.indexOf(campground._id);
            console.log(index);
            console.log(campground);
            console.log(req.user);
            if(index > -1){
                req.user.favourites.splice(index, 1);
                req.user.save();
                req.flash("success", "Campground removed from favourites");
            } else {
                req.flash("error", "Campground not found in your favourites");
            }
            res.redirect("/campgrounds/favourites")
        }
    });
});

module.exports = router;