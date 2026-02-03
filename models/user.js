const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

/*
This plugin automatically adds:
✔ username
✔ hash + salt
✔ register(), authenticate()
✔ serialize / deserialize
*/
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
