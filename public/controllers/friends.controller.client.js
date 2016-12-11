(function() {
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
                .then(function(obj) {
                    vm.user = obj.data
                }, function(err) {
                    $location.url("/login")
                })
        }

        init()
    }

    function FriendsController(UserService) {
        var vm = this

        function init() {

            UserService
                .loggedIn()
                .then(function(obj) {
                    UserService
                        .users(obj.data.friends)
                        .then(function (obj) {
                            vm.friends = obj
                        }, function (err) {
                            console.log(err)
                        })

                }, function(err) {
                    console.log(err)
                })
        }

        init()
    }

    function RequestController(UserService) {
        var vm = this

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {

                    UserService
                        .users(obj.data.requests)
                        .then(function (obj) {
                            vm.requests = obj
                        }, function (err) {
                            console.log(err)
                        })

                }, function(err) {
                    console.log(err)
                })
        }

        init()
    }

    function ApprovalController(UserService) {
        var vm = this

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {

                    UserService
                        .users(obj.data.approvals)
                        .then(function (obj) {
                            vm.approvals = obj
                        }, function (err) {
                            console.log(err)
                        })

                }, function(err) {
                    console.log(err)
                })
        }

        init()
    }

    function SearchController() {
        var vm = this

        function init() {

        }

        init()
    }
})()