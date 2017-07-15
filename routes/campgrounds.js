var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// =============================================================================
// ROUTES
// =============================================================================

//CREATE - Post route to add a new campground to the database
router.post("/", middleware.isLoggedIn, function(req,res){
    var author = {
        username: req.user.username,
        id: req.user._id
    };
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        author: author
    };
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong; Please try again");
            res.redirect("back");
        } else {
            req.flash("success", "Campground added");
            res.redirect("/campgrounds");
        }
    });
});



//INDEX - displays all campgrounds
router.get("/", function(req,res){
    //retrieve campgrounds from database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Error ENCOUNTERED!");
            req.flash("error", "Something went wrong; Please try again");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//NEW - form for creating a new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW - shows info about a single campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log(err)
        }else{
            var favouriteTorF = false;
            if(req.user){
                console.log(req.user.favourites);
                console.log(req.params.id);
                req.user.favourites.forEach(function(favourite){
                    console.log(favourite);
                    if(favourite.equals(req.params.id)){
                        
                        favouriteTorF = true;
                    }
                });
            }
            console.log(favouriteTorF);
            console.log(req.user);
            res.render("campgrounds/show", {campground: foundCampground, favouriteTorF: favouriteTorF}); 
        }
    });
});




//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            console.log(err);
            res.redirect("/");
        }else{
            res.render("campgrounds/edit", {campground: foundCampground}); 
        }
    });
});


//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Edits successful");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        console.log("trying to delete");
        if(err){
            req.flash("error", "Something went wrong; Please try again");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Campground removed");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;