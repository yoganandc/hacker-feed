(function () {
    angular
        .module("HackerFeed")
        .controller("CommentController", CommentController)

    function CommentController($location, $routeParams, $sce, $timeout, HackerNewsService, UserService, ItemService) {
        var vm = this
        var id = parseInt($routeParams.id, 10)
        vm.friendIds = []
        vm.showModal = false
        vm.trustAsHtml = trustAsHtml
        vm.saveItem = saveItem
        vm.shareItem = shareItem
        vm.openModal = openModal
        vm.closeModal = closeModal

        init()

        function init() {
            delete vm.error

            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data

                    if(isNaN(id)) {
                        $location.url("/home")
                    }
                    else {
                        HackerNewsService
                            .comments(id)
                            .then(function(obj) {
                                processComments(obj.comments, 0)
                                vm.comments = obj.comments
                                vm.item = obj.item

                                if(vm.comments.length === 0) {
                                    vm.error = "No comments have been posted yet!"
                                }
                            }, function (err) {
                                console.log(err)
                            })

                        UserService
                            .users(vm.user.friends)
                            .then(function(obj) {
                                vm.friends = obj

                                vm.friends.forEach(function(friend) {
                                    vm.friendIds.push({id: friend._id, selected: false})
                                })

                            }, function (err) {
                                console.log(err)
                            })
                    }

                }, function(err) {
                    $location.url("/login")
                })
        }

        function trustAsHtml(html) {
            return $sce.trustAsHtml(html)
        }

        function saveItem(itemId) {
            delete vm.message

            var item = {post: itemId}

            ItemService
                .createItem(vm.user._id, item)
                .then(function(obj) {
                    vm.message = "Post saved successfully!"
                }, function(err){
                    vm.message = err.data.message
                })
        }

        function shareItem() {
            delete vm.message

            var j = 0
            var k = 0
            vm.friendIds.forEach(function(friendId) {
                if(friendId.selected) {
                    var item = {post: vm.itemId}
                    ItemService
                        .shareItem(vm.user._id, friendId.id, item)
                        .then(function(obj) {
                            j++
                            k++
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
                    if(j === vm.friendIds.length && k > 0) {
                        vm.message = "Post shared successfully!"
                        $timeout(function() {
                            delete vm.message
                        }, 10000)
                        vm.showModal = false
                    }
                    else {
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

        function processComments(comments, depth) {
            for(var i = 0; i < comments.length; i++) {
                var comment = comments[i]
                comment.depth = depth
                processComments(comments[i].comments, depth + 1)
            }
        }
    }

})()