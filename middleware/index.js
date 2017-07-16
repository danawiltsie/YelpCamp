var Comment = require("../models/comment");
var Campground = require("../models/campground");

var middlewareObject = {
    
    checkCampgroundOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Could not find requested campground");
                    res.redirect("back");
                } else {
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "Could not complete action: You do not own this campground");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to use this feature");
            res.redirect("back");
        }
    },
    
    checkCommentOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Could not find requested comment");
                    res.redirect("back");
                } else {
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "Could not complete action: You do not own this comment");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to use this feature");
            res.redirect("back");
        }
    },
    
    isLoggedIn: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        } else {
            req.session.returnTo = req.headers.referer;
            req.flash("error", "You must be logged in to use this feature");
            res.redirect("/login");
        }
    }
    
};// End of Object




module.exports = middlewareObject;