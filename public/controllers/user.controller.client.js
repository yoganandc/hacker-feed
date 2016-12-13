(function() {
    angular
        .module("HackerFeed")
        .controller("UserController", UserController)
        .controller("UserProfileController", UserProfileController)
        .controller("UserBoardController", UserBoardController)

    function UserController($location, $routeParams, UserService) {
        var vm = this
        var friendId = $routeParams.id

        function init() {
            UserService
                .loggedIn()
                .then(function (obj) {
                    vm.user = obj.data

                    UserService
                        .findUserById(friendId)
                        .then(function(obj) {

                            vm.friend = obj.data

                        }, function(err) {
                            $location.url("/home")
                        })
                }, function (err) {
                    $location.url("/login")
                })
        }

        init()
    }

    function UserProfileController(UserService) {
        var vm = this

        function init() {

        }

        init()
    }

    function UserBoardController($routeParams, UserService, ItemService, HackerNewsService) {
        var vm = this
        vm.refresh = refresh

        function init() {
            refresh()
        }

        function refresh() {
            var friendId = $routeParams.id

            UserService
                .findUserById(friendId)
                .then(function(obj) {

                    vm.user = obj.data

                    ItemService
                        .findItemsByUser(vm.user._id)
                        .then(function(obj) {

                            vm.items = obj.data

                            vm.items.forEach(function (item) {
                                if (typeof item._friend !== "undefined") {
                                    UserService
                                        .findUserById(item._friend)
                                        .then(function (obj) {

                                            item.username = obj.data.username

                                        }, function (err) {
                                            console.log(err)
                                        })
                                }

                                HackerNewsService
                                    .item(item.post)
                                    .then(function (obj) {

                                        item.url = obj.url
                                        item.title = obj.title

                                    }, function (err) {
                                        console.log(err)
                                    })
                            })
                        }, function(err) {
                            console.log(err)
                        })
                }, function(err) {
                    console.log(err)
                })
        }

        init()
    }
})()