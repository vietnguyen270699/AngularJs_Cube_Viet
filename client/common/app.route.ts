module app {
    'use strict'
    
    // @param $routeProvider
    

    angularModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise("loginpage");
       
        let mainpage = {
            name: 'mainpage',
            url: '/mainpage',
            templateUrl: '/client/views/mainPage.html',
            controller: 'MainPageController',
            controllerAs: 'vm'
        }
        let loginpage = {
            name: 'loginpage',
            url: '/loginpage',
            templateUrl: '/client/views/loginPage.html',
            controller: 'loginPageController',
            controllerAs: 'vm'
        }
        let editpage = {
            name: 'editpage',
            url: '/editpage',
            templateUrl: '/client/views/editPage.html',
            controller: 'editPageController',
            controllerAs: 'vm'
        }
        $stateProvider.state(mainpage)
                    .state(loginpage)
                    .state(editpage);

    }])

   
}