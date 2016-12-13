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

    function AdminSearchController($timeout, UserService) {
        var vm = this
        vm.search = search
        vm.updateUser = updateUser
        vm.deleteUser = deleteUser
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
            delete vm.error
            delete vm.message

            UserService
                .findUserById(userId)
                .then(function(obj) {
                    vm.showModal = true
                    vm.profile = obj.data
                }, function(err) {
                    vm.error = err.data.message
                    $timeout(function() {
                        delete vm.error
                    }, 10000)
                })

        }

        function closeModal() {
            vm.showModal = false
        }

        function updateUser() {
            UserService
                .updateUser(vm.userId, vm.profile)
                .then(function(obj) {

                    var index = -1
                    for(var i = 0; i < vm.results.length; i++) {
                        var result = vm.results[i]

                        if(result._id === vm.userId) {
                            index = i
                            break
                        }
                    }

                    vm.showModal = false
                    vm.results.splice(index, 1, obj.data)
                    vm.message = "Updated Successfully"
                    $timeout(function() {
                        delete vm.message
                    }, 10000)

                }, function(err) {
                    vm.showModal = false
                    vm.error = err.data.message
                    $timeout(function() {
                        delete vm.error
                    }, 10000)
                })
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .then(function(obj) {

                    var index = -1
                    for(var i = 0; i < vm.results.length; i++) {
                        var result = vm.results[i]

                        if(result._id === vm.userId) {
                            index = i
                            break
                        }
                    }

                    vm.showModal = false
                    vm.results.splice(index, 1)
                    vm.message = "Deleted Successfully"
                    $timeout(function() {
                        delete vm.message
                    }, 10000)

                }, function(err) {
                    vm.showModal = false
                    vm.error = err.data.message
                    $timeout(function() {
                        delete vm.error
                    }, 10000)
                })
        }
    }

    function AdminCreateController() {
        var vm = this

        init()

        function init() {

        }
    }
})()