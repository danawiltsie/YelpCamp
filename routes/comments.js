var express = require("express");
var passport = require("passport");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ++++++++++++++++++++++++++
// Comment routes
// ++++++++++++++++++++++++++

// NEW - form for creating a new comment on a campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("ERROR FINDING NEW COMMENT FORM")
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

// CREATE - Post route for adding a new comment to a campground
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log("ERROR FINDING CAMPGROUND");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong; Please try again");
                    console.log("ERROR POSTING COMMENT");
                } else {
                    //add user data to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(err, campground){
                        if(err){
                            req.flash("error", "Something went wrong; Please try again");
                            console.log(err);
                            res.redirect("back");
                        } else {
                           middleware.calculateAverageRatingAndSave(req); 
                        }
                    });
                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });    
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err, comment){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Edit successful");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log(err);
            res.redirect("back");
        } else {
            middleware.calculateAverageRatingAndSave(req);
            req.flash("success", "Comment removed");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;

