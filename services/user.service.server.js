var LocalStrategy = require("passport-local")
var bcrypt = require("bcrypt-nodejs")

module.exports = function (app, passport, UserModel, utils, ObjectId) {

    passport.serializeUser(function(user, done) {
        done(null, user._id)
    })

    passport.deserializeUser(function(id, done) {
        UserModel
            .findUserById(id)
            .then(function(obj) {
                done(null, obj)
            })
            .catch(function(err) {
                done(null, err)
            })
    })

    passport.use(new LocalStrategy(
        function(username, password, done) {
            console.log("AUTH")
            UserModel
                .findUserByUsername(username)
                .then(function(obj) {
                    if(bcrypt.compareSync(password, obj.password)) {
                        delete obj.password
                        return done(null, obj)
                    }
                    else {
                        return done(null, false, {message: "No user with given credentials found"})
                    }
                })
                .catch(function(err) {
                    return done(null, false, {message: utils.extractErrorMessage(err)})
                })
        }
    ))

    app.post("/api/user/login", passport.authenticate("local"), function(req, res) {
        console.log("POST /api/user/login")

        res.status(200).send(req.user)
        return
    })

    app.post("/api/user/logout", function(req, res) {
        console.log("POST /api/user/logout")

        if(req.isAuthenticated()) {
            req.session.destroy(function(err) {
                res.status(204).send()
            })
        }
        else {
            res.status(204).send()
        }
    })

    app.get("/api/user/loggedin", function(req, res) {
        console.log("GET /api/user/loggedin")

        if(req.isAuthenticated()) {
            res.status(200).send(req.user)
            return
        }
        else {
            res.status(404).send()
            return
        }
    })

    app.post("/api/user", createUser)
    app.get("/api/user/:uid", findUserById)
    app.put("/api/user/:uid", updateUser)
    app.put("/api/user/:uid/request/:fid", friendRequest)
    app.put("/api/user/:uid/approve/:fid", friendApprove)
    app.delete("/api/user/:uid", deleteUser)

    function createUser(req, res) {
        console.log("POST /api/user")

        var user = req.body

        if(typeof user.password !== "undefined") {
            user.password = bcrypt.hashSync(user.password)
        }

        user.type = "STANDARD"
        UserModel
            .createUser(user)
            .then(function (obj) {
                req.login(obj, function(err) {
                    if(err) {
                        res.status(400).send({message: "Unable to login"})
                    }
                    res.status(201).send(req.user)
                })
            })
            .catch(function (err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function findUserById(req, res) {
        console.log("GET /api/user/:uid")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }
        userId = new ObjectId(userId.toString().toLowerCase())

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        UserModel
            .findUserById(userId)
            .then(function (obj) {
                if(!req.user._id.equals(userId) && !utils.containsId(req.user.friends, userId)) {
                    delete obj.friends
                    delete obj.approvals
                    delete obj.requests
                    delete obj.items
                    res.status(200).send(obj)
                }
                else {
                    res.status(200).send(obj)
                }
            })
            .catch(function (err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function updateUser(req, res) {
        console.log("PUT /api/user/:uid")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }
        userId = new ObjectId(userId.toString().toLowerCase())

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(!req.user._id.equals(userId)) {
            res.status(403).send()
            return
        }

        var user = req.body

        UserModel
            .updateUser(userId, user)
            .then(function (obj) {
                res.status(200).send(obj)
            })
            .catch(function (err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function deleteUser(req, res) {
        console.log("DELETE /api/user/:uid")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }
        userId = new ObjectId(userId.toString().toLowerCase())

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(!req.user._id.equals(userId)) {
            res.status(403).send()
            return
        }

        UserModel
            .deleteUser(userId)
            .then(function(obj) {
                res.status(204).send()
            })
            .catch(function (err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function friendRequest(req, res) {
        console.log("PUT /api/user/:uid/request/:fid")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }
        userId = new ObjectId(userId.toString().toLowerCase())

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(!req.user._id.equals(userId)) {
            res.status(403).send()
            return
        }

        var friendId = req.params.fid

        if (!utils.validate(friendId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }

        UserModel
            .friendRequest(userId, friendId)
            .then(function(obj) {
                res.status(204).send()
            })
            .catch(function(err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function friendApprove(req, res) {
        console.log("PUT /api/user/:uid/request/:fid")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }
        userId = new ObjectId(userId.toString().toLowerCase())

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(!req.user._id.equals(userId)) {
            res.status(403).send()
            return
        }

        var friendId = req.params.fid

        if (!utils.validate(friendId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }

        UserModel
            .friendApprove(userId, friendId)
            .then(function(obj) {
                res.status(204).send()
            })
            .catch(function(err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }
}