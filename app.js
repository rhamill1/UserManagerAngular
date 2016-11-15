var app = angular.module("userApp", ["ngRoute"]);

//Configure routes
app.config(function($routeProvider) {
    $routeProvider
        .when("/users", {
            templateUrl: "templates/user-list.html",
            controller: "UsersController",
            controllerAs: "usersCtrl"
        })
        .otherwise({
            redirectTo: "/users"
        });
});

app.controller("UsersController", function() {

});
