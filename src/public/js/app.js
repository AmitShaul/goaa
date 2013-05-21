'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('App', ["ui.bootstrap", "ngCookies", "google-maps"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.
        when('/', {
            templateUrl: 'partials/login',
            controller: 'LoginCtrl'
        }).
        when('/home', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup',
            controller: 'SignupCtrl'
        }).
        when('/test', {
            templateUrl: 'partials/test',
            controller: 'TestCtrl'
        }).
        when('/createGroup', {
            templateUrl: 'partials/createGroup',
            controller: 'CreateGroupCtrl'
        }).
        when('/joinGroup', {
            templateUrl: 'partials/joinGroup',
            controller: 'JoinGroupCtrl'
        }).
        when('/groupPreview', {
            templateUrl: 'partials/groupPreview',
            controller: 'GroupPreviewCtrl'
        }).
//      when('/addPost', {
//        templateUrl: 'partials/addPost',
//        controller: AddPostCtrl
//      }).
//      when('/readPost/:id', {
//        templateUrl: 'partials/readPost',
//        controller: ReadPostCtrl
//      }).
//      when('/editPost/:id', {
//        templateUrl: 'partials/editPost',
//        controller: EditPostCtrl
//      }).
//      when('/deletePost/:id', {
//        templateUrl: 'partials/deletePost',
//        controller: DeletePostCtrl
//      }).
    otherwise({
        redirectTo: '/'
    });
  }])
    .run(function($rootScope, account, $location) {

        log("application start");

        account.update();

        //redirect unautrize user to login
        if($location.path() != '/signup' && !account.isLoggedIn()){
            log("user not loggedin, redirecting to login");
            $location.path('/');
        }
    });
