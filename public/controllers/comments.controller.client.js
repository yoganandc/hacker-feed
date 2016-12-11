(function () {
    angular
        .module("HackerFeed")
        .controller("CommentController", CommentController)

    function CommentController($location, $routeParams, $sce, HackerNewsService) {
        var vm = this
        var id = parseInt($routeParams.id, 10)
        vm.trustAsHtml = trustAsHtml

        function init() {
            if(isNaN(id)) {
                $location.url("/home")
            }

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