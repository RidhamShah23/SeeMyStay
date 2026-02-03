const Listing = require("../models/listing");

module.exports = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // 🛑 SAFETY CHECK
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
