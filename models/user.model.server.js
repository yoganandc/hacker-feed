var bcrypt = require("bcrypt-nodejs")

module.exports = function (model, ItemModel, utils, q) {

    function createUser(user) {
        var deferred = q.defer()

        model
            .create(user, function (err, res) {

                if (err) {
                    if (err.name === "MongoError") {
                        deferred.reject("Username already taken")
                    }
                    else {
                        deferred.reject(err)
                    }
                }
                else {
                    res = res.toObject()
                    delete res.password
                    deferred.resolve(res)
                }
            })

        return deferred.promise
    }

    function findUserById(userId) {
        var deferred = q.defer()

        model.findById(userId, function (err, res) {
            if (err) {
                deferred.reject(err)
            }
            else if (!res) {
                deferred.reject("No user with given ID found")
            }
            else {
                res = res.toObject()
                delete res.password
                deferred.resolve(res)
            }
        })

        return deferred.promise
    }

    // returns user object with password
    function findUserByUsername(username) {
        var deferred = q.defer()

        model.findOne({username: username},
            function (err, res) {
                if (err) {
                    deferred.reject(err)
                }
                else if (!res) {
                    deferred.reject("No user with given username found")
                }
                else {
                    res = res.toObject()
                    deferred.resolve(res)
                }
            })

        return deferred.promise
    }

    function findUserByProfile(profile) {
        var deferrred = q.defer()

        model.findOne({profile: profile},
            function (err, res) {
                if(err) {
                    deferrred.reject(err)
                }
                else if(!res) {
                    deferrred.reject("No user with given profile found")
                }
                else {
                    res = res.toObject()
                    delete res.password
                    deferrred.resolve(res)
                }
            })

        return deferrred.promise
    }

    function findAdminUsers() {
        var deferred = q.defer()

        model
            .find({type: "ADMIN"})
            .lean()
            .exec(function (err, res) {
                if(err) {
                    deferred.reject(err)
                }
                else {
                    res.forEach(function(user) {
                        delete user.password
                        delete user.items
                        delete user.friends
                        delete user.requests
                        delete user.approvals
                    })
                    deferred.resolve(res)
                }
            })

        return deferred.promise
    }

    function updateUser(userId, user) {
        var deferred = q.defer()

        model.findById(userId, function (err, res) {
            if (err) {
                deferred.reject(err)
            }
            else if (!res) {
                deferred.reject("User with given ID not found")
            }
            else {
                utils.copy(res, user, "firstName")
                utils.copy(res, user, "lastName")
                utils.copy(res, user, "email")

                if (typeof user.password !== "undefined" && user.password && user.password.trim()) {
                    res.password = bcrypt.hashSync(user.password.trim())
                }

                res.save(function (err, res2) {
                    if (err) {
                        deferred.reject(err)
                    }
                    else {
                        res2 = res2.toObject()
                        delete res2.password
                        deferred.resolve(res2)
                    }
                })
            }
        })

        return deferred.promise
    }

    function deleteUser(userId) {
        var deferred = q.defer()

        model.findById(userId, function(err, res) {
            if(err) {
                deferred.reject(err)
            }
            else if(!res) {
                deferred.reject("No user with given ID found")
            }
            else {

                deferred.reject("Unimplemented")

            }
        })

        return deferred.promise
    }

    function friendRequest(userId, friendId) {
        var deferred = q.defer()

        model.findById(userId, function (err, res) {
            if (err) {
                deferred.reject(err)
            }
            else if (!res) {
                deferred.reject("User with given ID not found")
            }
            else {

                if (res.friends.indexOf(friendId) !== -1) {
                    deferred.reject("Already in friends list")
                }
                else if (res.approvals.indexOf(friendId) !== -1) {
                    deferred.reject("Friend request already sent")
                }
                else if (res.requests.indexOf(friendId) !== -1) {
                    deferred.reject("This person has sent you a friend request")
                }
                else {
                    model.findById(friendId, function (err, res2) {
                        if (err) {
                            deferred.reject(err)
                        }
                        else if (!res2) {
                            deferred.reject("Friend with given ID not found")
                        }
                        else {

                            res2.requests.push(userId)
                            res2.save(function (err) {
                                if (err) {
                                    deferred.reject(err)
                                }
                                else {

                                    res.approvals.push(friendId)
                                    res.save(function (err) {
                                        if (err) {
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

            }
        })

        return deferred.promise
    }

    function friendApprove(userId, friendId) {
        var deferred = q.defer()

        model.findById(userId, function (err, res) {
            if (err) {
                deferred.reject(err)
            }
            else if (!res) {
                deferred.reject("User with given ID not found")
            }
            else {

                if (res.friends.indexOf(friendId) !== -1) {
                    deferred.reject("Already in friends list")
                }
                else if (res.requests.indexOf(friendId) === -1) {
                    deferred.reject("This person did not send you a friend request")
                }
                else if (res.approvals.indexOf(friendId) !== -1) {
                    deferred.reject("You sent this person a friend request")
                }
                else {

                    model.findById(friendId, function (err, res2) {
                        if (err) {
                            deferred.reject(err)
                        }
                        else if (!res) {
                            deferred.reject("Friend with given ID not found")
                        }
                        else {

                            res2.approvals.splice(res2.approvals.indexOf(userId), 1)
                            res2.friends.push(userId)
                            res2.save(function (err) {
                                if (err) {
                                    deferred.reject(err)
                                }
                                else {

                                    res.requests.splice(res.requests.indexOf(friendId), 1)
                                    res.friends.push(friendId)
                                    res.save(function (err) {
                                        if (err) {
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

            }
        })

        return deferred.promise
    }

    // note: this returns the password too!
    function searchUsersByUsername(username) {
        var deferred = q.defer()

        model
            .find()
            .or([{username: new RegExp(username, "i")}, {firstName: new RegExp(username, "i")}, {lastName: new RegExp(username, "i")}])
            .lean()
            .exec(function (err, res) {
                if (err) {
                    deferred.reject(err)
                }
                else {
                    res.forEach(function (user) {
                        delete user.password
                        delete user.friends
                        delete user.requests
                        delete user.approvals
                        delete user.items
                    })
                    deferred.resolve(res)
                }
            })

        return deferred.promise
    }

    return {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByProfile: findUserByProfile,
        findAdminUsers: findAdminUsers,
        updateUser: updateUser,
        deleteUser: deleteUser,
        friendRequest: friendRequest,
        friendApprove: friendApprove,
        searchUsersByUsername: searchUsersByUsername
    }
}