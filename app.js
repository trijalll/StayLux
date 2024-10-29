const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const listing = require("./models/listing.js"); // Correct import
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(methodOverride("_method"));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/error.js");

main()
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wondermark");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "fonts")));
app.use(express.static(path.join(__dirname, "assets")));


//show all Listings
app.get("/listings", async (req, res) => {
  const AllHotel = await listing.find({});
  res.render("listings/index.ejs", { AllHotel });
});


//Show Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create Listing Route
// let{Title,Description,Price,Location,Country} = req.body;

app.post("/listings/new", wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    // Changed to 400 Bad Request
    throw new ExpressError(400, "Send valid data for listing");
  }

  let listingData = req.body.listing; // Renamed variable for clarity
  let newListing = new listing(listingData); // Assuming 'Listing' is your Mongoose model
  await newListing.save();
  res.redirect("/listings"); // Redirect to the listings page
}));



//show Edit Listings Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let OneList = await listing.findById(id);
  res.render("listings/edit.ejs", { OneList });
});

//edit route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let updateData = req.body.listing;
  let UpdateHotel = await listing.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  // console.log(UpdateHotel);
  res.redirect("/listings");
});

//Delete Listing
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let DeleteData = await listing.findByIdAndDelete(id);
  console.log(DeleteData);
  res.redirect("/listings");
});

//show details Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const HotelId = await listing.findById(id);
  res.render("listings/show.ejs", { HotelId });
});

// app.get("/testing", async (req, res) => {
//     const Hotel_1 = new listing({
//         title: 'lala_1',
//         description: "mai hu jiyan",
//         price: 2000,
//         location: "jabalpur",
//         country: "india"
//     });
//     await Hotel_1.save();  // Save to the database
//     console.log('Data saved');
//     res.send("Kaam ho gaya");
// });

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found !'));
});


app.use((err,req,res,next)=>{
  let{statusCode=500,message="something gadbad hai dost!"}= err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs",{err});
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
