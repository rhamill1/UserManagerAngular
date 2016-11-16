var app = angular.module("userApp", ["ngRoute"]);

//Configure routes
app.config(function($routeProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: "templates/login.html",
            controller: "LoginController",
            controllerAs: "loginCtrl"
        })
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

app.controller("UsersController", function($http, AuthService) {
    //Step 1: Make HTTP request to Rails API to retrieve list of users (Hint: look up the $http service)
    //Step 2: Use Angular's template syntax to display the users
    AuthService.isAuthenticated();
    var vm = this;

    $http({
        method: "GET",
        url: "http://localhost:3000/users",
        headers: {
            "Authorization": "Token token=" + AuthService.getToken()
        }
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

app.controller("EditUserController", function($http, $location, $routeParams, AuthService) {
    AuthService.isAuthenticated();
    var vm = this;

    //Pull specific user and insert into edit form
    $http({
        method: "GET",
        url: "http://localhost:3000/users/" + $routeParams.id + "/edit",
        headers: {
            "Authorization": "Token token=" + AuthService.getToken()
        }
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
            },
            headers: {
                "Authorization": "Token token=" + AuthService.getToken()
            }
        }).success(function() {
            $location.path("/users");
        }).error(function() {
            alert("Error updating user");
        });
    }
});

app.controller("LoginController", function($http, $location, AuthService){
    var vm = this;

    vm.loginUser = function(event){
        event.preventDefault()

        $http({
            method: "POST",
            url: "http://localhost:3000/login",
            data: vm.user
        }).success(function(user){
            AuthService.setSession(user);
            $location.path("/users");
        }).error(function(){
            alert("Unauthorized!");
        })
    }
})


app.service("AuthService", function($location){
    this.setSession = function(user) {
        return localStorage.setItem("current_user", JSON.stringify(user));
    }

    this.getToken = function() {
        var currentUser = JSON.parse(localStorage.getItem("current_user"));
        return currentUser.auth_token;
    }

    this.currentUser = function(){
        return JSON.parse(localStorage.getItem("current_user"));
    }

    this.isAuthenticated = function() {
        if (this.currentUser()){
            return;
        } else {
            $location.path("/login");
        }
    }
});
