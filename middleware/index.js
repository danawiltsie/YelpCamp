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
            req.flash("error", "You must be logged in to use this feature");
            res.redirect("/login");
        }
    },
    
    calculateAverageRatingAndSave: function(req){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        }else{
            var sumOfRating = 0;
            campground.comments.forEach(function(comment){
                console.log("Its ya boi, comment");
                sumOfRating += comment.rating;
            });
            var averageRating = 0;
            if(sumOfRating > 0){
                averageRating = sumOfRating/campground.comments.length;
            }
            campground.averageRating = averageRating.toFixed(2);
            campground.save();
        }
    });
}
    
};// End of Object




module.exports = middlewareObject;