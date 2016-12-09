module.exports = function(app, mongoose, passport) {
    var utils = require("./utils.js")(mongoose)
    var q = require("q")

    var UserSchema = require("./schemas/user.schema.server.js")(mongoose, utils)
    var ItemSchema = require("./schemas/item.schema.server.js")(mongoose, utils)

    var UserModel = require("./models/user.model.server.js")(UserSchema, utils, q)
    var ItemModel = require("./models/item.model.server")(ItemSchema, utils, q)

    require("./services/user.service.server.js")(app, passport, UserModel, utils)
    require("./services/item.service.server.js")(app, passport, ItemModel, utils)
}