(function() {
    angular
        .module("HackerFeed")
        .controller("HomeController", HomeController)
        .controller("TopStoriesController", TopStoriesController)
        .controller("BestStoriesController", BestStoriesController)
        .controller("NewStoriesController", NewStoriesController)

    function HomeController($location, UserService, $rootScope) {
        var vm = this

        function init() {

            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj
                }, function(err) {
                    $location.url("/login")
                })
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
})()