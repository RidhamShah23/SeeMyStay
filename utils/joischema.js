const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(3).required(),

        description: Joi.string().allow(""),

        image: Joi.object({
            url: Joi.string().uri().allow("")
        }).required(),

        price: Joi.number().min(100).required(),

        location: Joi.string().required(),

        country: Joi.string().required()
    }).required()
});

module.exports = { listingSchema };
