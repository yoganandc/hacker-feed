(function() {
    angular
        .module("HackerFeed")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("LogoutController", LogoutController)

    function LoginController($location, $routeParams, UserService) {
        var vm = this
        vm.login = login

        function init() {

            if($routeParams.error) {
                vm.error = $routeParams.error
            }

            UserService
                .loggedIn()
                .then(function(obj) {
                    $location.url("/home")
                }, function(err) {

                })
        }

        function login() {
            delete vm.error
            var msg = ""

            var valid = (typeof vm.username !== "undefined") && vm.username
            if(!valid) {
                msg = "No username entered"
            }

            if(valid) {
                valid = (typeof vm.password !== "undefined") && vm.password
                if(!valid) {
                    msg = "No password entered"
                }
            }

            if(valid) {
                UserService
                    .findUserByCredentials(vm.username, vm.password)
                    .then(function(obj) {
                        $location.url("/home")
                    }, function(err) {
                        if(err.data.message) {
                            vm.error = err.data.message
                        }
                        else {
                            vm.error = "Incorrect username or password"
                        }
                    })
            }
            else {
                vm.error = msg
            }
        }

        init()
    }

    function RegisterController($location, UserService) {
        var vm = this
        vm.register = register

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {
                    $location.url("/home")
                }, function(err) {

                })
        }

        function register() {
            delete vm.error
            var msg = ""

            var valid = (typeof vm.username !== "undefined") && vm.username
            if(!valid) {
                msg = "No username entered"
            }

            if(valid) {
                valid = (typeof vm.password !== "undefined") && vm.password
                if(!valid) {
                    msg = "No password entered"
                }
            }

            if(valid) {
                UserService
                    .createUser({username: vm.username, password: vm.password})
                    .then(function(obj) {
                        $location.url("/home")
                    }, function (err) {
                        vm.error = err.data.message
                    })
            }
            else {
                vm.error = msg
            }
        }

        init()
    }

    function ProfileController($location, $timeout, UserService) {
        var vm = this
        vm.updateUser = updateUser
        vm.deleteUser = deleteUser

        function init() {
            UserService
                .loggedIn()
                .then(function(obj) {
                    vm.user = obj.data
                }, function(err) {
                    $location.url("/login")
                })
        }

        function updateUser() {
            delete vm.error
            delete vm.message

            UserService
                .updateUser(vm.user._id, vm.user)
                .then(function(obj) {
                    vm.user = obj.data
                    vm.message = "Profile updated successfully!"
                    $timeout(function() {
                        delete vm.message
                    }, 10000)
                }, function(err) {
                    vm.error = err.data.message
                })
        }

        function deleteUser() {
            delete vm.error
            delete vm.message

            UserService
                .deleteUser(vm.user._id)
                .then(function(obj) {
                    $location.url("/login")
                }, function(err) {
                    vm.error = err.data.message
                })
        }

        init()
    }

    function LogoutController($location, $rootScope, UserService) {

        function init() {
            delete $rootScope.boardItems

            UserService
                .logout()
                .then(function (obj) {
                    $location.url("/login")
                }, function (err) {

                })
        }

        init()
    }
})()