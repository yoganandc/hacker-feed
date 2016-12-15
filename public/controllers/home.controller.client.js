(function() {
    angular
        .module("HackerFeed")
        .controller("HomeController", HomeController)
        .controller("TopStoriesController", TopStoriesController)
        .controller("BestStoriesController", BestStoriesController)
        .controller("NewStoriesController", NewStoriesController)
        .controller("BoardController", BoardController)

    function HomeController($location, $timeout, UserService, ItemService) {
        var vm = this
        vm.saveItem = saveItem
        vm.shareItem = shareItem
        vm.openModal = openModal
        vm.closeModal = closeModal
        vm.showModal = false
        vm.friendIds = []

        function init() {

            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data

                    vm.friends = []

                    UserService
                        .users(vm.user.friends)
                        .then(function(obj) {
                            vm.friends = obj

                            vm.friends.forEach(function(friend) {
                                vm.friendIds.push({id: friend._id, selected: false})
                            })

                        }, function(err) {
                            console.log(err)
                        })

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
                    $timeout(function() {
                        delete vm.message
                    }, 10000)
                }, function (err) {
                    vm.message = err.data.message
                    $timeout(function() {
                        delete vm.message
                    }, 10000)
                })
        }

        function shareItem() {
            delete vm.message

            var j = 0
            vm.friendIds.forEach(function(friendId) {
                if(friendId.selected) {
                    var item = {post: vm.itemId}
                    ItemService
                        .shareItem(vm.user._id, friendId.id, item)
                        .then(function(obj) {
                            j++
                            if(j === vm.friendIds.length) {
                                vm.message = "Post shared successfully!"
                                $timeout(function() {
                                    delete vm.message
                                }, 10000)
                                vm.showModal = false
                            }
                        }, function(err) {
                            vm.message = err.data.message
                            $timeout(function() {
                                delete vm.message
                            }, 10000)
                            vm.showModal = false
                        })

                }
                else {
                    j++
                    if(j === vm.friendIds.length) {
                        vm.message = "Post shared successfully!"
                        $timeout(function() {
                            delete vm.message
                        }, 10000)
                        vm.showModal = false
                    }
                }
            })
        }

        function openModal(itemId) {
            vm.itemId = itemId

            vm.friendIds.forEach(function(friendId) {
                friendId.selected = false
            })

            vm.showModal = true
        }

        function closeModal() {
            vm.showModal = false
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

    function BoardController($rootScope, $timeout, UserService, ItemService, HackerNewsService) {
        var vm = this
        vm.refresh = refresh
        vm.deleteItem = deleteItem

        function init() {
            if(typeof $rootScope.boardItems === "undefined") {
                refresh()
            }
            else {
                vm.items = $rootScope.boardItems
            }
        }

        function refresh() {
            delete vm.error
            delete vm.message

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

                })
        }

        function deleteItem(itemId) {
            delete vm.error
            delete vm.message

            ItemService
                .deleteItem(vm.user._id, itemId)
                .then(function(obj) {

                    var index = -1
                    for(var i = 0; i < vm.items.length; i++) {
                        if(vm.items[i]._id === itemId) {
                            index = i
                            break
                        }
                    }

                    vm.items.splice(index, 1)
                    vm.message = "Deleted successfully!"
                    $timeout(function() {
                        delete vm.message
                    }, 10000)

                }, function (err) {
                    vm.error = err.data.message
                    $timeout(function() {
                        delete vm.error
                    }, 10000)
                })
        }

        init()
    }

})()