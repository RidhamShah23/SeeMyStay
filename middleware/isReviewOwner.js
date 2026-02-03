const Review = require("../models/review");

module.exports = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
