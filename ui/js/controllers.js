'use strict';


myapp.controller('HeadController', ['$scope', 'appconf', '$location', 'toaster', '$http',
function($scope, appconf, $location, toaster, $http) {
    $scope.title = appconf.title;
    $scope.username = localStorage.getItem('uid');
    $scope.role = localStorage.getItem('role');


    $scope.login = function(){
        sessionStorage.setItem('auth_redirect', appconf.default_redirect_url);
        $location.path("/signin");
    };

    $scope.logout = function(){
        $scope.username = undefined;
        localStorage.removeItem('uid');
        localStorage.removeItem('role');
        localStorage.removeItem(appconf.jwt_id);
        window.location = appconf.base_url + appconf.default_redirect_url;
    };


}]);

myapp.controller('SigninController', ['$scope', 'appconf', '$location', 'toaster', '$http',
function($scope, appconf, $location, toaster, $http) {

    $scope.begin_iucas = function() {
        window.location = appconf.iucas_url+'?cassvc=IU&casurl='+window.location;
    };

    $scope.validate = function(casticket) {
        $http.get(appconf.api +'/verify?casticket='+casticket)
            .then(function(res) {;
                console.log(res);
                localStorage.setItem(appconf.jwt_id, res.data.jwt);
                localStorage.setItem('uid', res.data.uid);
                localStorage.setItem('role', res.data.role);
                var redirect = sessionStorage.getItem('auth_redirect');
                sessionStorage.removeItem('auth_redirect');
                console.log("done.. redirecting "+redirect);
                window.location = appconf.base_url + redirect;
            }, function(res) {
                console.dir(res);
                if(res.data && res.data.path) {
                    window.location = res.data.path;
                } else {
                    window.location = appconf.base_url + appconf.default_redirect_url;
                }
            });
    }

    console.log("iucascb::app.run ref:"+document.referrer);
    var casticket = getParameterByName('casticket');
    if(casticket === undefined || casticket === ''){
        $scope.begin_iucas();
    } else {
        $scope.validate(casticket);
    }

}]);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


myapp.controller('HomeController', ['$scope', 'appconf', '$route', 'toaster', '$http', '$location',
function($scope, appconf, $route, toaster, $http, $location) {
    
    $scope.jwt = localStorage.getItem(appconf.jwt_id);   

    $scope.getSystems = function() {
        $http.get(appconf.api+'/pvsys').then(function(res) {
            $scope.pvsys = res.data;
        }, function(err) {
            console.log("Error contacting API");
            console.dir(err);
        });
    };
    //$scope.getSystems();
}]);
