(function () {
    angular
        .module("HackerFeed")
        .config(Config)

    function Config($routeProvider, $rootScopeProvider) {
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
            .when("/profile", {
                templateUrl: "/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/friends", {
                templateUrl: "/views/friends.view.client.html",
                controller: "FriendController",
                controllerAs: "model"
            })
            .when("/user/:id", {
                templateUrl: "/views/user.view.client.html",
                controller: "UserController",
                controllerAs: "model"
            })
            .when("/logout", {
                template: " ",
                controller: "LogoutController"
            })
            .when("/home", {
                templateUrl: "/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/comments/:id", {
                templateUrl: "/views/comments.view.client.html",
                controller: "CommentController",
                controllerAs: "model"
            })
            .when("/admin", {
                templateUrl: "/views/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/home"
            })

        $rootScopeProvider
            .digestTtl(15)
    }
})()