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

    function AdminSearchController(UserService) {
        var vm = this
        vm.search = search
        vm.updateUser = updateUser
        vm.openModal = openModal
        vm.closeModal = closeModal
        vm.showModal = false

        init()

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data
                }, function(err) {
                    console.log(err)
                })
        }

        function search() {
            delete vm.error
            delete vm.message

            UserService
                .searchUsersByUsername(vm.query)
                .then(function (obj) {
                    vm.results = obj.data
                    if(vm.results.length === 0) {
                        vm.message = "No results found."
                    }
                }, function (err) {
                    vm.error = err.data.message
                })
        }

        function openModal(userId) {
            vm.userId = userId
            vm.showModal = true
        }

        function closeModal() {
            vm.showModal = false
        }

        function updateUser() {
            vm.showModal = false
        }
    }

    function AdminCreateController() {
        var vm = this

        init()

        function init() {

        }
    }
})()