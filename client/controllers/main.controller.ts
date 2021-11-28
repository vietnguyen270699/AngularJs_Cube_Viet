module app {
    'use strict'



    angularModule.controller('MainPageController', function ($scope, $location, $http, $rootScope,store) {

    
        $scope.internName= store.getLoginName();
        $scope.dateEnd = store.getDateEnd();
     
          
        })

}