(function() {
    angular
        .module("HackerFeed")
        .controller("ItemController", ItemController)

    function ItemController($location, $routeParams, $sce, HackerNewsService) {
        var vm = this
        var itemId = parseInt($routeParams.id, 10)

        function init() {
            if(isNaN(itemId)) {
                $location.url("/home")
            }

            HackerNewsService
                .item(itemId)
                .then(function(obj) {
                    vm.item = obj
                }, function(err) {
                    $location.url("/home")
                })
        }

        init()
    }
})()