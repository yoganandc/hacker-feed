module.exports = function(app, mongoose, passport) {
    var ObjectId = mongoose.Types.ObjectId

    var utils = require("./utils.js")(ObjectId)
    var q = require("q")

    var UserSchema = require("./schemas/user.schema.server.js")(mongoose, utils)
    var ItemSchema = require("./schemas/item.schema.server.js")(mongoose, utils)

    var UserMongooseModel = mongoose.model("User", UserSchema)
    var ItemMongooseModel = mongoose.model("Item", ItemSchema)

    var UserModel = require("./models/user.model.server.js")(UserMongooseModel, utils, q)
    var ItemModel = require("./models/item.model.server.js")(ItemMongooseModel, UserMongooseModel, utils, q)

    require("./services/user.service.server.js")(app, passport, UserModel, utils, ObjectId)
    require("./services/item.service.server.js")(app, ItemModel, utils, ObjectId)
}