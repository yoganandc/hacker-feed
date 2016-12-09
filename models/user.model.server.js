module.exports = function (model, utils, q) {

    function createUser(user) {
        var deferred = q.defer()

        model
            .create(user, function (err, res) {
                if (err) {
                    if(err.name === "MongoError") {
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
            else if(!res) {
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
                else if(!res) {
                    deferred.reject("No user with given username found")
                }
                else {
                    res = res.toObject()
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

        deferred.reject("Unimplemented")

        return deferred.promise
    }

    return {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser
    }
}