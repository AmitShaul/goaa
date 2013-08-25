
angular.module('App').controller('LoginCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'authService',
    function($scope, blockui, $http, $location, account, $cookies, authService){

    // checking if logged in allready redirecting to Home
    if (account.isLoggedIn()){
        $location.path('/home').replace(); //redirect wont create new page in the history
    }

    var form = {
        username: "",
        password: "",
        remeberme: false
    }
    ,
    loginFailed = false;

    // public var
    $scope.hideMenu         = true;
    $scope.form             = form;
    $scope.loginFailed      = loginFailed;

    var login = function() {

        log("login for username: " + form.username);

        blockui.block();

        $http.post('/login', form)
            .error(function(data, status, headers, config){
                $scope.loginFailed = true;
                setTimeout(function(){
                    if (status == 401){
                        log("user unauthorized");
                        blockui.unblock();
                    } else {
                        httpErrorCallback(data, status, headers, config);
                    }
                }, 500);
            })
            .success(function(data, status, headers, config) {
                log(data);
                if (data != null && data.result){
                    blockui.unblock();
                    $scope.loginFailed = false;
                    $cookies.user = '12' + angular.toJson(data.user);
                    account.update();
                    log('authService.loginConfirmed', authService);
                    authService.loginConfirmed();
                    $location.path('/home').replace(); //redirect wont create new page in the history
                }
            });
    };

    // public functions
    $scope.login = login;
    $scope.account = account;
}]);
