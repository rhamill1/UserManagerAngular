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

app.controller("UsersController", function($http) {
    //Step 1: Make HTTP request to Rails API to retrieve list of users (Hint: look up the $http service)
    //Step 2: Use Angular's template syntax to display the users

    var vm = this;

    $http({
        method: "GET",
        url: "http://localhost:3000/users"
    }).success(function(users) {
        vm.users = users;
    }).error(function() {
        alert("Error getting users!");
    });

    vm.submitUser = function(event) {
        event.preventDefault();

        $http({
            method: "POST",
            url: "http://localhost:3000/users",
            data: {
                user: vm.user
            }
        }).success(function(newUser) {
            vm.users.push(newUser);

            vm.user = {};
            $("#add-user-modal").modal("hide");
        }).error(function() {
            alert("Error saving user");
        });
    }
});
