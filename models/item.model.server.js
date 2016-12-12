module.exports = function(model, UserModel, utils, q) {

    function createItem(userId, item) {
        var deferred = q.defer()

        UserModel
            .findById(userId, function(err, res) {
                if(err) {
                    deferred.reject(err)
                }
                else if(!res) {
                    deferred.reject("No user with given ID found")
                }
                else {

                    item._user = userId
                    model
                        .create(item, function(err, res) {
                            if(err) {
                                deferred.reject(err)
                            }
                            else {
                                res = res.toObject()
                                deferred.resolve(res)
                            }
                        })

                }
            })

        return deferred.promise
    }

    function findItemById(userId, itemId) {
        var deferred = q.defer()

        model
            .findOne({_user: userId, _id: itemId}, function(err, res) {
                if(err) {
                    deferred.reject(err)
                }
                else if(!res) {
                    deferred.reject("No item with given ID found")
                }
                else {
                    res = res.toObject()
                    deferred.resolve(res)
                }
            })

        return deferred.promise
    }

    function findItemsByUserId(userId) {
        var deferred = q.defer()

        UserModel
            .findById(userId, function(err, res) {
                if(err) {
                    deferred.reject(err)
                }
                else if(!res) {
                    deferred.reject("No user with given ID found")
                }
                else {

                    model
                        .find({_user: userId})
                        .lean()
                        .exec(function(err, res) {
                            if(err) {
                                deferred.reject(err)
                            }
                            else {
                                deferred.resolve(res)
                            }
                        })

                }
            })

        return deferred.promise
    }

    function deleteItem(userId, itemId) {
        var deferred = q.defer()

        model
            .findOne({_user: userId, _id: itemId}, function(err, res) {
                if(err) {
                    deferred.reject(err)
                }
                else if(!res) {
                    deferred.reject("Item with given ID not found")
                }
                else {

                    res.populate("_user", function(err, res2) {
                        if(err) {
                            deferred.reject(err)
                        }
                        else {
                            res2._user.items.splice(res2.indexOf(itemId), 1)

                            res2._user.save(function(err, res3) {
                                if(err) {
                                    deferred.reject(err)
                                }
                                else {
                                    res.remove(function(err, res4) {
                                        if(err) {
                                            deferred.reject(err)
                                        }
                                        else {
                                            deferred.resolve(null)
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })

        return deferred.promise
    }

    return {
        createItem: createItem,
        findItemById: findItemById,
        findItemsByUserId: findItemsByUserId,
        deleteItem: deleteItem
    }

}