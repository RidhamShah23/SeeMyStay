const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const review = new Review({
    rating: req.body.review.rating,
    comment: req.body.review.comment,
    username: req.user.username,
    owner: req.user._id,
  });

  await review.save();
  listing.reviews.push(review._id);
  await listing.save();

  req.flash("success", "Review added");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};

module.exports.markHelpful = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review.helpful.includes(req.user._id)) {
    review.helpful.push(req.user._id);
    await review.save();
  }

  res.redirect(`/listings/${req.params.id}`);
};
