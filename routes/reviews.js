const express = require("express");
const router = express.Router({ mergeParams: true });

const reviews = require("../controllers/reviews");
const wrapAsync = require("../utils/wrapAsync");
const isLoggedIn = require("../middleware/isLoggedIn");
const isReviewOwner = require("../middleware/isReviewOwner");

router.post("/", isLoggedIn, wrapAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviews.deleteReview)
);

router.post(
  "/:reviewId/helpful",
  isLoggedIn,
  wrapAsync(reviews.markHelpful)
);

module.exports = router;
