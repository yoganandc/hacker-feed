module.exports = function(app, ItemModel, utils) {
    app.post("/api/user/:uid/item", createItem)
    app.get("/api/user/:uid/item/:id", findItemById)
    app.get("/api/user/:uid/item", findItemsByUserId)
    app.delete("/api/user/:uid/item/:id", deleteItem)

    function createItem(req, res) {
        console.log("POST /api/user/:uid/item")

        var userId = req.params.uid

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(req.user._id !== userId) {
            res.status(403).send()
            return
        }

        var item = req.body

        if(req.query.share) {
            var friendId = req.query.share

            if(req.user.friends.indexOf(friendId) === -1) {
                res.status(400).send({message: "No friend with given ID found"})
            }
            else {
                item._friend = userId
                ItemModel
                    .createItem(friendId, item)
                    .then(function(obj) {
                        res.status(204).send()
                    })
                    .catch(function(err) {
                        res.status(400).send({message: utils.extractErrorMessage(err)})
                    })
            }
        }
        else {
            ItemModel
                .createItem(userId, item)
                .then(function(obj) {
                    res.status(201).send(obj)
                })
                .catch(function(err) {
                    res.status(400).send({message: utils.extractErrorMessage(err)})
                })
        }

    }

    function findItemById(req, res) {
        console.log("GET /api/user/:uid/item/:id")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No item with given ID found"})
            return
        }

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(req.user._id !== userId && req.user.friends.indexOf(userId) === -1) {
            res.status(400).send("No item with given ID found")
            return
        }

        var itemId = req.params.id

        if (!utils.validate(itemId)) {
            res.status(400).send({message: "No item with given ID found"})
            return
        }

        ItemModel
            .findItemById(userId, itemId)
            .then(function(obj) {
                res.status(200).send(obj)
            })
            .catch(function(err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function findItemsByUserId(req, res) {
        console.log("GET /api/user/:uid/item")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(req.user._id !== userId && req.user.friends.indexOf(userId) === -1) {
            res.status(400).send("No user with given ID found")
            return
        }

        ItemModel
            .findItemsByUserId(userId)
            .then(function(obj) {
                res.status(200).send(obj)
            })
            .catch(function(err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }

    function deleteItem(req, res) {
        console.log("DELETE /api/user/:uid/item/:id")

        var userId = req.params.uid

        if (!utils.validate(userId)) {
            res.status(400).send({message: "No user with given ID found"})
            return
        }

        if(!req.isAuthenticated()) {
            res.status(401).send()
            return
        }

        if(req.user._id != userId) {
            res.status(403).send()
            return
        }

        var itemId = req.params.id

        if (!utils.validate(itemId)) {
            res.status(400).send({message: "No item with given ID found"})
            return
        }

        ItemModel
            .deleteItem(userId, itemId)
            .then(function(obj) {
                res.status(204).send()
            })
            .catch(function(err) {
                res.status(400).send({message: utils.extractErrorMessage(err)})
            })
    }
}