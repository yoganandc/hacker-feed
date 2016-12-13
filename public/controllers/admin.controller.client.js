(function() {
    angular
        .module("HackerFeed")
        .controller("AdminController", AdminController)
        .controller("AdminSearchController", AdminSearchController)
        .controller("AdminCreateController", AdminCreateController)

    function AdminController($location, UserService) {
        var vm = this

        init()

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data

                    if(vm.user.type !== "ADMIN") {
                        $location.url("/home")
                    }

                }, function(err) {
                    $location.url("/login")
                })
        }
    }

    function AdminSearchController() {
        var vm = this

        init()

        function init() {

        }
    }

    function AdminCreateController() {
        var vm = this

        init()

        function init() {

        }
    }
})()