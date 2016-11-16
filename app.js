var app = angular.module("userApp", ["ngRoute"]);

//Configure routes
app.config(function($routeProvider) {
    $routeProvider
        .when("/users", {
            templateUrl: "templates/user-list.html",
            controller: "UsersController",
            controllerAs: "usersCtrl"
        })
        .when("/users/:id/edit", {
            templateUrl: "templates/edit-user.html",
            controller: "EditUserController",
            controllerAs: "editUserCtrl"
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

app.controller("EditUserController", function($http, $location, $routeParams) {
    var vm = this;

    //Pull specific user and insert into edit form
    $http({
        method: "GET",
        url: "http://localhost:3000/users/" + $routeParams.id + "/edit"
    }).success(function(user) {
        vm.user = user;
    }).error(function() {
        alert("Error getting specific user");
    });

    //Capture submit event, prevent default, and update user server-side
    vm.submitEdits = function(event) {
        event.preventDefault();

        $http({
            method: "PUT",
            url: "http://localhost:3000/users/" + $routeParams.id,
            data: {
                user: vm.user
            }
        }).success(function() {
            $location.path("/users");
        }).error(function() {
            alert("Error updating user");
        });
    }
});
