(function () {
    angular
        .module("HackerFeed")
        .factory("UserService", UserService)

    function UserService($http, $q) {

        function createUser(user) {
            var url = "/api/user"
            return $http.post(url, user)
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId
            return $http.get(url)
        }

        function searchUsersByUsername(username) {
            var url = "/api/user?search=" + username
            return $http.get(url)
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user/login"
            var creds = {username: username, password: password}
            return $http.post(url, creds)
        }

        function findAdminUsers() {
            var url = "/api/user/admin"
            return $http.get(url)
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId
            return $http.put(url, user)
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId
            return $http.delete(url)
        }

        function logout() {
            return $http.post("/api/user/logout")
        }

        function loggedIn() {
            return $http.get("/api/user/loggedin")
        }

        function users(userIds) {
            var deferred = $q.defer()

            var users = []
            if(userIds.length > 0) {

                var j = 0
                for(var i = 0; i < userIds.length; i++) {

                    $http.get("/api/user/" + userIds[i])
                        .then(function (obj) {
                            users.push(obj.data)

                            j++
                            if(j === userIds.length) {
                                deferred.resolve(users)
                            }

                        }, function (err) {
                            deferred.reject(err)
                        })
                }

            }
            else {
                deferred.resolve(users)
            }

            return deferred.promise
        }

        function friendRequest(userId, friendId) {
            var url = "/api/user/" + userId + "/request/" + friendId
            return $http.put(url)
        }

        function friendApprove(userId, friendId) {
            var url = "/api/user/" + userId + "/approve/" + friendId
            return $http.put(url)
        }

        return {
            loggedIn: loggedIn,
            createUser: createUser,
            findUserById: findUserById,
            searchUsersByUsername: searchUsersByUsername,
            findUserByCredentials: findUserByCredentials,
            findAdminUsers: findAdminUsers,
            updateUser: updateUser,
            deleteUser: deleteUser,
            logout: logout,
            users: users,
            friendRequest: friendRequest,
            friendApprove: friendApprove
        }

    }
})()