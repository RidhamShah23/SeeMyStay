const express = require("express");
const router = express.Router();

const listings = require("../controllers/listings");
const upload = require("../middleware/upload");
const wrapAsync = require("../utils/wrapAsync");
const isLoggedIn = require("../middleware/isLoggedIn");

router
  .route("/")
  .get(wrapAsync(listings.index))
  .post(
    isLoggedIn,
    upload.single("image"),   // 🔥 IMAGE MIDDLEWARE HERE
    wrapAsync(listings.createListing)
  );

router.get("/new", isLoggedIn, listings.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listings.showListing))
  .put(
    isLoggedIn,
    upload.single("image"),   // 🔥 for updating image
    wrapAsync(listings.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listings.deleteListing));

router.get("/:id/edit", isLoggedIn,  upload.single("image"),wrapAsync(listings.renderEditForm));

module.exports = router;
