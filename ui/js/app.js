'use strict';

var myapp = angular.module('myapp', [
    'app.config',
    'ngRoute',
    'ngAnimate',
    'toaster',
    'angular-jwt'
]);

//configure route
myapp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: '/t/home.html',
        controller: 'HomeController',
        requiresLogin: false
    })
    .when('/signin', {
        template: '<h4>Redirecting to CAS...</h4>',
        controller: 'SigninController'
    })
    .otherwise({
        redirectTo: '/home'
    });
}]).run(['$rootScope', '$location', 'toaster', 'jwtHelper', 'appconf', function($rootScope, $location, toaster, jwtHelper, appconf) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        //redirect to /signin if user hasn't authenticated yet
        if(next.requiresLogin) {
            var jwt = localStorage.getItem(appconf.jwt_id);
            console.dir(jwt);
            if(jwt == null || jwtHelper.isTokenExpired(jwt)) {
                toaster.warning("Please sign in first");
                console.log(next.originalPath);
                sessionStorage.setItem('auth_redirect', next.originalPath);
                $location.path("/signin");
                event.preventDefault();
            }
        }
    });
}]);

myapp.config(['$locationProvider', function($locationProvider){
    $locationProvider
        .html5Mode(true);
}]);


