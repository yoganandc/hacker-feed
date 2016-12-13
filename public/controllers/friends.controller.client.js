(function () {
    angular
        .module("HackerFeed")
        .controller("FriendController", FriendController)
        .controller("FriendsController", FriendsController)
        .controller("RequestController", RequestController)
        .controller("ApprovalController", ApprovalController)
        .controller("SearchController", SearchController)

    function FriendController($location, UserService) {
        var vm = this

        function init() {
            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data

                }, function (err) {
                    $location.url("/login")
                })
        }

        init()
    }

    function FriendsController(UserService) {
        var vm = this
        vm.init = init

        function init() {
            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data

                    UserService
                        .users(obj.data.friends)
                        .then(function (obj) {
                            vm.friends = obj
                        }, function (err) {
                            console.log(err)
                        })

                }, function (err) {
                    console.log(err)
                })
        }

        init()
    }

    function RequestController(UserService) {
        var vm = this
        vm.init = init
        vm.friendApprove = friendApprove

        function init() {
            delete vm.message

            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data

                    UserService
                        .users(obj.data.requests)
                        .then(function (obj) {
                            vm.requests = obj
                            if(vm.requests.length === 0) {
                                vm.message = "No friend requests at this time"
                            }
                        }, function (err) {
                            console.log(err)
                        })

                }, function (err) {
                    console.log(err)
                })
        }

        function friendApprove(friendId) {
            delete vm.message

            UserService
                .friendApprove(vm.user._id, friendId)
                .then(function(obj) {
                    UserService
                        .loggedIn()
                        .then(function (obj) {
                            vm.user = obj.data

                            UserService
                                .users(obj.data.requests)
                                .then(function (obj) {
                                    vm.requests = obj

                                }, function (err) {
                                    console.log(err)
                                })

                        }, function (err) {
                            console.log(err)
                        })

                    vm.message = "Friend request accepted!"
                }, function(err) {
                    console.log(err)
                })
        }

        init()
    }

    function ApprovalController(UserService) {
        var vm = this
        vm.init = init

        function init() {
            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data

                    UserService
                        .users(obj.data.approvals)
                        .then(function (obj) {
                            vm.approvals = obj
                        }, function (err) {
                            console.log(err)
                        })

                }, function (err) {
                    console.log(err)
                })
        }

        init()
    }

    function SearchController(UserService) {
        var vm = this
        vm.search = search
        vm.friendRequest = friendRequest

        function init() {
            delete vm.error
            delete vm.message

            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data
                }, function (err) {
                    console.log(err)
                })
        }

        function search() {
            delete vm.error
            delete vm.message

            UserService
                .searchUsersByUsername(vm.query)
                .then(function (obj) {
                    vm.results = obj.data
                    if(vm.results.length === 0) {
                        vm.message = "No results found."
                    }
                }, function (err) {
                    vm.error = err.data.message
                })
        }

        function friendRequest(friendId) {
            delete vm.error
            delete vm.message

            UserService
                .friendRequest(vm.user._id, friendId)
                .then(function(obj) {
                    UserService
                        .loggedIn()
                        .then(function (obj) {
                            vm.user = obj.data
                        }, function (err) {
                            console.log(err)
                        })

                    vm.message = "Friend request sent!"
                })
                .catch(function(err) {
                    vm.error = err.data.message
                })
        }

        init()
    }
})()