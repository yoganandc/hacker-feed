(function () {
    angular
        .module("HackerFeed")
        .config(Config)

    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "/views/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "/views/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/home", {
                templateUrl: "/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/login"
            })
    }
})()