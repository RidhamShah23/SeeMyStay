const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

async function assignOwner() {
  const admin = await User.findOne();

  const listings = await Listing.find({ owner: { $exists: false } });

  for (let listing of listings) {
    listing.owner = admin._id;
    await listing.save();
  }

  console.log("Owners assigned to old listings");
  mongoose.connection.close();
}

assignOwner();
