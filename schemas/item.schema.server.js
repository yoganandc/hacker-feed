module.exports = function(mongoose, utils) {

    var schema = mongoose.Schema({

        _user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "No User ID given"], validate: {validator: utils.validate, message: "Invalid User ID"}},
        post: {type: Number, set: function(v) { return Math.round(v) }, get: function(v) { return Math.round(v) }, min: [1, "Invalid Post ID"]}

    }, {
        timestamps: true
    })

    return schema
}