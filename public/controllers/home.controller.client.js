(function() {
    angular
        .module("HackerFeed")
        .controller("HomeController", HomeController)
        .controller("TopStoriesController", TopStoriesController)
        .controller("BestStoriesController", BestStoriesController)
        .controller("NewStoriesController", NewStoriesController)
        .controller("BoardController", BoardController)

    function HomeController($location, UserService, ItemService) {
        var vm = this
        vm.saveItem = saveItem
        vm.shareItem = shareItem
        vm.clearMessage = clearMessage

        function init() {

            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data
                }, function(err) {
                    $location.url("/login")
                })
        }

        function saveItem(itemId) {
            delete vm.message

            var item = {post: itemId}

            ItemService
                .createItem(vm.user._id, item)
                .then(function(obj) {
                    vm.message = "Post saved successfully!"
                }, function (err) {
                    vm.message = err.data.message
                })
        }

        function shareItem(friendId, itemId) {
            delete vm.message

            var item = {post: itemId}

            ItemService
                .shareItem(vm.user._id, friendId, item)
                .then(function(obj) {
                    vm.message = "Post shared successfully!"
                }, function(err) {
                    vm.message = err.data.message
                })
        }

        function clearMessage() {
            delete vm.message
        }

        init()
    }

    function TopStoriesController($rootScope, HackerNewsService) {
        var vm = this

        function init() {
            if(typeof $rootScope.topItems === "undefined") {
                HackerNewsService
                    .topStories()
                    .then(function(obj) {
                        $rootScope.topItems = obj
                        vm.items = obj
                    }, function(err) {
                        console.log(err)
                    })
            }
            else {
                vm.items = $rootScope.topItems
            }
        }

        init()
    }

    function BestStoriesController($rootScope, HackerNewsService) {
        var vm = this

        function init() {
            if(typeof $rootScope.bestItems === "undefined") {
                HackerNewsService
                    .bestStories()
                    .then(function(obj) {
                        $rootScope.bestItems = obj
                        vm.items = obj
                    }, function(err) {
                        console.log(err)
                    })
            }
            else {
                vm.items = $rootScope.bestItems
            }
        }

        init()
    }

    function NewStoriesController($rootScope, HackerNewsService) {
        var vm = this

        function init() {
            if(typeof $rootScope.newItems === "undefined") {
                HackerNewsService
                    .newStories()
                    .then(function(obj) {
                        $rootScope.newItems = obj
                        vm.items = obj
                    }, function(err) {
                        console.log(err)
                    })
            }
            else {
                vm.items = $rootScope.newItems
            }
        }

        init()
    }

    function BoardController($rootScope, UserService, ItemService, HackerNewsService) {
        var vm = this
        vm.init = init

        function init() {
            if(typeof $rootScope.boardItems === "undefined") {
                UserService
                    .loggedIn()
                    .then(function(obj) {
                        vm.user = obj.data

                        ItemService
                            .findItemsByUser(vm.user._id)
                            .then(function(obj) {

                                vm.items = obj.data
                                $rootScope.boardItems = obj.data

                                vm.items.forEach(function(item) {
                                    if(typeof item._friend !== "undefined") {
                                        UserService
                                            .findUserById(item._friend)
                                            .then(function(obj) {

                                                item.username = obj.data.username

                                            }, function(err) {
                                                console.log(err)
                                            })
                                    }

                                    HackerNewsService
                                        .item(item.post)
                                        .then(function(obj) {

                                            item.url = obj.url
                                            item.title = obj.title

                                        }, function(err) {
                                            console.log(err)
                                        })
                                })

                            }, function(err) {
                                console.log(err)
                            })
                    }, function(err) {
                        $location.url("/login")
                    })
            }
            else {
                vm.items = $rootScope.boardItems
            }
        }

        init()
    }

})()