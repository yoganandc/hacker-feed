(function () {
    angular
        .module("HackerFeed")
        .controller("CommentController", CommentController)

    function CommentController($location, $routeParams, $sce, HackerNewsService, UserService) {
        var vm = this
        var id = parseInt($routeParams.id, 10)
        vm.trustAsHtml = trustAsHtml

        function init() {

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
                            }, function (err) {
                                $location.url("/home")
                            })
                    }

                }, function(err) {
                    $location.url("/login")
                })
        }

        function processComments(comments, depth) {
            for(var i = 0; i < comments.length; i++) {
                var comment = comments[i]
                comment.depth = depth
                processComments(comments[i].comments, depth + 1)
            }
        }

        function trustAsHtml(html) {
            return $sce.trustAsHtml(html)
        }

        init()
    }

})()