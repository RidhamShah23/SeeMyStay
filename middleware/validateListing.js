const { listingSchema } = require("../utils/joischema");
const ExpressError = require("../utils/expresserror");

module.exports = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    }

    next();
};
