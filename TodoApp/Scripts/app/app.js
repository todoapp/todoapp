﻿var app = angular.module("app", ['ngRoute']);

app.run(function ($templateCache, $http) {
    $http.get('/Scripts/app/views/home.html', { cache: $templateCache });
    $http.get('/Scripts/app/views/login.html', { cache: $templateCache });
    $http.get('/Scripts/app/views/register.html', { cache: $templateCache });
    $http.get('/Scripts/app/views/todo-items.html', { cache: $templateCache });
});

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/Scripts/app/views/home.html'
            }).
            when('/login', {
                templateUrl: '/Scripts/app/views/login.html'
            }).
            when('/register', {
                templateUrl: '/Scripts/app/views/register.html'
            }).
            when('/todos', {
                templateUrl: '/Scripts/app/views/todo-items.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

app.controller("RegisterCtrl", function ($scope, $http, $location) {

    $scope.update = function (user) {

        var data = {
            Email: user.email,
            Password: user.password,
            ConfirmPassword: user.passwordConfirm
        };

        $http.post("/api/Account/Register", data)
            .success(function (data) {
                $location.path('/login');
            });
    }
});

app.controller("LoginCtrl", function ($scope, $http, $window, $location) {

    $scope.login = function (user) {
        var data = {
            grant_type: 'password',
            username: user.email,
            password: user.password
        };

        $http({
            url: '/Token',
            method: 'POST',
            data: "username=" + user.email + "&password=" + user.password + "&grant_type=password"
        })
            .success(function (data) {
                $window.sessionStorage.setItem('accessToken', data.access_token);
                $location.path('/todos');
            });
    }
});

app.controller("TodoItemsCtrl", function ($scope, $http, $window) {

    var token = $window.sessionStorage.getItem('accessToken');
    var headers = {};
    if (token) {
        headers.Authroization = 'Bearer ' + token;
    }

    $http({
        method: 'GET',
        url: 'api/TodoItems',
        headers: headers
    })
        .success(function (data) {
            console.log(data);
        });
})