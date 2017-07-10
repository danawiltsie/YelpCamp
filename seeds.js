var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"Country Maples",
        image:"https://farm5.staticflickr.com/4274/34752990060_7825abe206.jpg",
        description:"Lorem ipsum dolor sit amet, aenean fringilla at pede lorem nec sed, curabitur in, feugiat turpis, a in nisl donec eu aenean. Molestie in nibh diam. Nibh est hendrerit, purus donec est sit, enim ut elit, vel et dui diam, lacus justo pharetra sed. Elit ipsum ullamcorper, donec mi a pharetra in, erat vivamus possimus. Imperdiet potenti pellentesque consectetuer dignissimos odio, dignissim semper integer tellus, nunc pede mollis cras, condimentum tincidunt at aliquet ac. Dis massa auctor mauris eros eros, tincidunt vel nisl, imperdiet posuere, leo nam sapien ridiculus orci."
    },
    {
        name:"Stoltz Pool",
        image:"https://farm4.staticflickr.com/3937/33874752352_7e070178e8.jpg",
        description:"Lorem ipsum dolor sit amet, aenean fringilla at pede lorem nec sed, curabitur in, feugiat turpis, a in nisl donec eu aenean. Molestie in nibh diam. Nibh est hendrerit, purus donec est sit, enim ut elit, vel et dui diam, lacus justo pharetra sed. Elit ipsum ullamcorper, donec mi a pharetra in, erat vivamus possimus. Imperdiet potenti pellentesque consectetuer dignissimos odio, dignissim semper integer tellus, nunc pede mollis cras, condimentum tincidunt at aliquet ac. Dis massa auctor mauris eros eros, tincidunt vel nisl, imperdiet posuere, leo nam sapien ridiculus orci."
    },
    {
        name:"Englishman River Falls",
        image:"https://farm2.staticflickr.com/1363/632961281_92345694e6.jpg",
        description:"Lorem ipsum dolor sit amet, aenean fringilla at pede lorem nec sed, curabitur in, feugiat turpis, a in nisl donec eu aenean. Molestie in nibh diam. Nibh est hendrerit, purus donec est sit, enim ut elit, vel et dui diam, lacus justo pharetra sed. Elit ipsum ullamcorper, donec mi a pharetra in, erat vivamus possimus. Imperdiet potenti pellentesque consectetuer dignissimos odio, dignissim semper integer tellus, nunc pede mollis cras, condimentum tincidunt at aliquet ac. Dis massa auctor mauris eros eros, tincidunt vel nisl, imperdiet posuere, leo nam sapien ridiculus orci."
    }
];

function seedDB(){
    //remove all existing campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log("COULDN'T CLEAR DATABASE");
        }else{
            console.log("CLEARED DATABASE");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("ADDED SEEDED CAMPGROUND");
                        Comment.create(
                            {
                                text: "This place is great, but I HATE the outdoors.",
                                author: "Dan Wiltsie"
                            }, 
                            function(err, comment){
                                if(err) console.log("ERROR POSTING COMMENTS");
                                else{
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                        });
                    }
                });
            });
        }
    });
    //add test campgrounds
}

module.exports = seedDB;