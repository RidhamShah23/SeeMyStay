const mongoose = require("mongoose");
const Listing = require("../models/listing");
const data = require("./data"); // your sample listings

mongoose.connect(process.env.ATLASDB_URL)
  .then(() => console.log("DB Connected"))
  .catch(console.log);

const seedDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
  console.log("Database Seeded");
};

seedDB().then(() => mongoose.connection.close());
