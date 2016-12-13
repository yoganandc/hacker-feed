module.exports = function(mongoose, utils) {

    var schema = mongoose.Schema({

        username: {type: String, required: [true, "No username entered"], trim: true, lowercase: true, unique: true},
        profile: {type: String, unique: true},
        password: {type: String},
        email: {type: String, trim: true, lowercase: true},
        firstName: {type: String, trim: true},
        lastName: {type: String, trim: true},
        items: [{type: mongoose.Schema.Types.ObjectId, ref: "Item", required: [true, "No Item ID given"], validate: {validator: utils.validate, message: "Invalid Item ID"}}],
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "No User ID given"], validate: {validator: utils.validate, message: "Invalid User ID"}}],
        requests: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "No User ID given"], validate: {validator: utils.validate, message: "Invalid User ID"}}],
        approvals: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "No User ID given"], validate: {validator: utils.validate, message: "Invalid User ID"}}],
        type: {type: String, required: [true, "No user type specified"], trim: true, uppercase: true, enum: {values: ["ADMIN", "STANDARD"], message: "Invalid user type"}}

    }, {
        timestamps: true
    })

    return schema
}