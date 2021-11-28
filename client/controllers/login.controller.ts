

module app {
    'use strict'


    angularModule.controller('loginPageController', function ($scope, $location, $http, $rootScope, store) {

        $scope.id = "";
        $scope.password = "";



        $scope.loginFnc = function () {
            $http.get(`http://localhost:8081/getintern?id=${$scope.id}`)
                .then((response) => {


                    store.setLoginName(response.data.name);

                    let date: Date = new Date();
                    let dayNow = date.getDate();
                    let dayInCompany = new Date(response.data.getInCompanyDay)
                    let diffDays = dayNow - dayInCompany.getDate();
                    let dateEnd = 60 - diffDays;

                    store.setDateEnd(dateEnd);

                    console.log("ngày hiện tại: " + dayNow);
                    console.log("ngày vào cty: " + dayInCompany.getDate());
                    console.log("số ngày: " + diffDays)

                   
                   


                    if ($scope.password == "admin") {
                        $location.path("/mainpage")
                    } else {
                        alert('ERR: Wrong Id or paswords')
                    }
                })

        }



    })

}