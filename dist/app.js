var app;
(function (app) {
    'use strict';
    app.templateUrlBase = './client/views';
    function Controller(name) {
        return function (clazz) {
            clazz.$name = name;
            app.angularModule.controller(name, clazz);
        };
    }
    app.Controller = Controller;
    function Directive(directive) {
        return function (clazz) {
            app.angularModule.directive(directive.name, function () {
                directive.controller = clazz;
                if (directive.templateUrl) {
                    directive.templateUrl = app.templateUrlBase + directive.templateUrl;
                }
                directive.controllerAs = 'vm';
                if (directive.bindToController) {
                    directive.scope = {};
                }
                return directive;
            });
        };
    }
    app.Directive = Directive;
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule = angular.module('app', ['ui.router']);
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("loginpage");
            var mainpage = {
                name: 'mainpage',
                url: '/mainpage',
                templateUrl: '/client/views/mainPage.html',
                controller: 'MainPageController',
                controllerAs: 'vm'
            };
            var loginpage = {
                name: 'loginpage',
                url: '/loginpage',
                templateUrl: '/client/views/loginPage.html',
                controller: 'loginPageController',
                controllerAs: 'vm'
            };
            var editpage = {
                name: 'editpage',
                url: '/editpage',
                templateUrl: '/client/views/editPage.html',
                controller: 'editPageController',
                controllerAs: 'vm'
            };
            $stateProvider.state(mainpage)
                .state(loginpage)
                .state(editpage);
        }]);
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule.controller('editPageController', function ($scope, $location, $http, $rootScope, $compile) {
        $scope.showupdate = false;
        $scope.disabledId = false;
        $scope.id = "";
        $scope.name = "";
        $scope.birthday = '';
        $scope.getInCompanyDay = '';
        $scope.showTemplateDialog = function (title, mess, mess2, mess3, mess4) {
            if (title === void 0) { title = "alert"; }
            if (mess === void 0) { mess = ""; }
            if (mess2 === void 0) { mess2 = ""; }
            if (mess3 === void 0) { mess3 = ""; }
            if (mess4 === void 0) { mess4 = ""; }
            var content = $scope.$new();
            var titleDialog = title;
            content.message = mess;
            content.message2 = mess2;
            content.message3 = mess3;
            content.message4 = mess4;
            $scope.showDialog(content, "dialogTemplate", titleDialog);
        };
        $scope.showDialog = function (dialogScope, template, titleDialog) {
            var div = $("<div id='dialog' ><div ng-include=\"'" + template + "'\"></div></div>");
            $compile(div)(dialogScope);
            div.dialog({
                buttons: {
                    OK: function () { $(this).dialog("close"); }
                },
                title: titleDialog
            });
        };
        $scope.searchFnc = function () {
            if ($scope.id == "") {
                $scope.showTemplateDialog("Thông báo", "Hãy nhập Internship ID.");
            }
            else {
                $http({
                    method: 'GET',
                    url: "http://localhost:8081/getintern?id=" + $scope.id
                }).then(function successCallback(response) {
                    $scope.name = response.data.name;
                    $scope.birthday = response.data.birthday;
                    $scope.getInCompanyDay = response.data.getInCompanyDay;
                    $scope.disabledId = true;
                    $scope.showupdate = true;
                    $scope.showTemplateDialog("Kết quả tìm kiếm", "Insertship ID: " + $scope.id, "Insertship name: " + $scope.name + " ", "Internship birthday: " + $scope.birthday);
                }, function errorCallback(response) {
                    $scope.showTemplateDialog("Kết quả tìm kiếm", "Không tìm thấy kết quả nào.");
                });
            }
        };
        $scope.updateFnc = function () {
            $http({
                url: 'http://localhost:8081/updateintern',
                method: "POST",
                data: {
                    'id': $scope.id,
                    "name": $scope.name,
                    "birthday": $scope.birthday,
                    "getInCompanyDay": $scope.getInCompanyDay
                }
            })
                .then(function (response) {
                console.log("update thành công..........api");
                $scope.showTemplateDialog("Thông báo", "Update thành công.");
            }, function (response) {
                console.log("upadte lỗi..........api");
                $scope.showTemplateDialog("Thông báo", "Update thất bại.");
            });
        };
    });
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule.controller('loginPageController', function ($scope, $location, $http, $rootScope, store) {
        $scope.id = "";
        $scope.password = "";
        $scope.loginFnc = function () {
            $http.get("http://localhost:8081/getintern?id=" + $scope.id)
                .then(function (response) {
                store.setLoginName(response.data.name);
                var date = new Date();
                var dayNow = date.getDate();
                var dayInCompany = new Date(response.data.getInCompanyDay);
                var diffDays = dayNow - dayInCompany.getDate();
                var dateEnd = 60 - diffDays;
                store.setDateEnd(dateEnd);
                console.log("ngày hiện tại: " + dayNow);
                console.log("ngày vào cty: " + dayInCompany.getDate());
                console.log("số ngày: " + diffDays);
                if ($scope.password == "admin") {
                    $location.path("/mainpage");
                }
                else {
                    alert('ERR: Wrong Id or paswords');
                }
            });
        };
    });
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule.controller('MainPageController', function ($scope, $location, $http, $rootScope, store) {
        $scope.internName = store.getLoginName();
        $scope.dateEnd = store.getDateEnd();
    });
})(app || (app = {}));
var app;
(function (app) {
    var InternDto = (function () {
        function InternDto(internID, internName, internBirthday, internInCompanyDay) {
            this.internID = internID;
            this.internName = internName;
            this.internBirthday = internBirthday;
            this.internInCompanyDay = internInCompanyDay;
        }
        return InternDto;
    }());
    app.InternDto = InternDto;
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule.service('store', function () {
        var loginName = '';
        var dateEnd = 0;
        this.getLoginName = function () {
            return loginName;
        };
        this.getDateEnd = function () {
            return dateEnd;
        };
        this.setLoginName = function (name) {
            return loginName = name;
        };
        this.setDateEnd = function (date) {
            return dateEnd = date;
        };
    });
})(app || (app = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC9jb21tb24vYW5ub3RhdGlvbi50cyIsImNsaWVudC9jb21tb24vYXBwLm1vZHVsZS50cyIsImNsaWVudC9jb21tb24vYXBwLnJvdXRlLnRzIiwiY2xpZW50L2NvbnRyb2xsZXJzL2VkaXQuY29udHJvbGxlci50cyIsImNsaWVudC9jb250cm9sbGVycy9sb2dpbi5jb250cm9sbGVyLnRzIiwiY2xpZW50L2NvbnRyb2xsZXJzL21haW4uY29udHJvbGxlci50cyIsImNsaWVudC9kdG8vaW50ZXJuLmR0by50cyIsImNsaWVudC9zZXJ2aWNlL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxHQUFHLENBMkJUO0FBM0JELFdBQU8sR0FBRztJQUNOLFlBQVksQ0FBQztJQUNGLG1CQUFlLEdBQUcsZ0JBQWdCLENBQUM7SUFFOUMsU0FBZ0IsVUFBVSxDQUFDLElBQVk7UUFDbkMsT0FBTyxVQUFVLEtBQVU7WUFDdkIsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBQSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN6QyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBTGUsY0FBVSxhQUt6QixDQUFBO0lBQ0QsU0FBZ0IsU0FBUyxDQUFDLFNBQWM7UUFDcEMsT0FBTyxVQUFVLEtBQVU7WUFDdkIsSUFBQSxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUM3QixJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7b0JBQ3ZCLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBQSxlQUFlLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztpQkFDbkU7Z0JBQ0QsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBRTlCLElBQUksU0FBUyxDQUFDLGdCQUFnQixFQUFFO29CQUM1QixTQUFTLENB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TyxHQUFHO0lBQ04sWUFBWSxDQUFBO0lBRVosSUFBQSxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUczQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDaEIsT0FBTyxTQUFTLENBQUE7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRztZQUNkLE9BQU8sT0FBTyxDQUFBO1FBQ2xCLENBQUMsQ0FBQTtRQUdELElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxJQUFJO1lBQzlCLE9BQU8sU0FBUyxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDLENBQUE7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSTtZQUM1QixPQUFPLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLEVBeEJNLEdBQUcsS0FBSCxHQUFHLFFBd0JUIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBhcHAge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgZXhwb3J0IGxldCB0ZW1wbGF0ZVVybEJhc2UgPSAnLi9jbGllbnQvdmlld3MnO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBDb250cm9sbGVyKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoY2xheno6IGFueSkge1xyXG4gICAgICAgICAgICBjbGF6ei4kbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIGFuZ3VsYXJNb2R1bGUuY29udHJvbGxlcihuYW1lLCBjbGF6eilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gRGlyZWN0aXZlKGRpcmVjdGl2ZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjbGF6ejogYW55KSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXJNb2R1bGUuZGlyZWN0aXZlKGRpcmVjdGl2ZS5uYW1lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmUuY29udHJvbGxlciA9IGNsYXp6O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS50ZW1wbGF0ZVVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS50ZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsQmFzZSArIGRpcmVjdGl2ZS50ZW1wbGF0ZVVybDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5jb250cm9sbGVyQXMgPSAndm0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3RpdmUuYmluZFRvQ29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5zY29wZSA9IHt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsIm1vZHVsZSBhcHAge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gICAgZXhwb3J0IGxldCBhbmd1bGFyTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pXHJcbn0iLCJtb2R1bGUgYXBwIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgXHJcbiAgICAvLyBAcGFyYW0gJHJvdXRlUHJvdmlkZXJcclxuICAgIFxyXG5cclxuICAgIGFuZ3VsYXJNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgIFxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCJsb2dpbnBhZ2VcIik7XHJcbiAgICAgICBcclxuICAgICAgICBsZXQgbWFpbnBhZ2UgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdtYWlucGFnZScsXHJcbiAgICAgICAgICAgIHVybDogJy9tYWlucGFnZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2NsaWVudC92aWV3cy9tYWluUGFnZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ01haW5QYWdlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbG9naW5wYWdlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnbG9naW5wYWdlJyxcclxuICAgICAgICAgICAgdXJsOiAnL2xvZ2lucGFnZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2NsaWVudC92aWV3cy9sb2dpblBhZ2UuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpblBhZ2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBlZGl0cGFnZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJ2VkaXRwYWdlJyxcclxuICAgICAgICAgICAgdXJsOiAnL2VkaXRwYWdlJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvY2xpZW50L3ZpZXdzL2VkaXRQYWdlLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnZWRpdFBhZ2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKG1haW5wYWdlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdGF0ZShsb2dpbnBhZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0YXRlKGVkaXRwYWdlKTtcclxuXHJcbiAgICB9XSlcclxuXHJcbiAgIFxyXG59IiwiXHJcblxyXG5tb2R1bGUgYXBwIHtcclxuICAndXNlIHN0cmljdCdcclxuXHJcbiAgYW5ndWxhck1vZHVsZS5jb250cm9sbGVyKCdlZGl0UGFnZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCAkcm9vdFNjb3BlLCAkY29tcGlsZSkge1xyXG5cclxuICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2VcclxuICAgICRzY29wZS5kaXNhYmxlZElkID0gZmFsc2VcclxuICAgICRzY29wZS5pZCA9IFwiXCJcclxuICAgICRzY29wZS5uYW1lID0gXCJcIlxyXG4gICAgJHNjb3BlLmJpcnRoZGF5ID0gJydcclxuICAgICRzY29wZS5nZXRJbkNvbXBhbnlEYXkgPSAnJ1xyXG5cclxuXHJcbiAgICAvL3Nob3cgZGlhbG9nXHJcbiAgICAkc2NvcGUuc2hvd1RlbXBsYXRlRGlhbG9nID0gZnVuY3Rpb24gKHRpdGxlID0gXCJhbGVydFwiLCBtZXNzID0gXCJcIiwgbWVzczIgPSBcIlwiLCBtZXNzMyA9IFwiXCIsIG1lc3M0ID0gXCJcIikge1xyXG4gICAgICB2YXIgY29udGVudCA9ICRzY29wZS4kbmV3KCk7XHJcbiAgICAgIHZhciB0aXRsZURpYWxvZyA9IHRpdGxlO1xyXG4gICAgICBjb250ZW50Lm1lc3NhZ2UgPSBtZXNzO1xyXG4gICAgICBjb250ZW50Lm1lc3NhZ2UyID0gbWVzczI7XHJcbiAgICAgIGNvbnRlbnQubWVzc2FnZTMgPSBtZXNzMztcclxuICAgICAgY29udGVudC5tZXNzYWdlNCA9IG1lc3M0O1xyXG4gICAgICAkc2NvcGUuc2hvd0RpYWxvZyhjb250ZW50LCBcImRpYWxvZ1RlbXBsYXRlXCIsIHRpdGxlRGlhbG9nKVxyXG4gICAgfTtcclxuICAgICRzY29wZS5zaG93RGlhbG9nID0gZnVuY3Rpb24gKGRpYWxvZ1Njb3BlLCB0ZW1wbGF0ZSwgdGl0bGVEaWFsb2cpIHtcclxuICAgICAgdmFyIGRpdiA9ICQoXCI8ZGl2IGlkPSdkaWFsb2cnID48ZGl2IG5nLWluY2x1ZGU9XFxcIidcIiArIHRlbXBsYXRlICsgXCInXFxcIj48L2Rpdj48L2Rpdj5cIik7XHJcbiAgICAgICRjb21waWxlKGRpdikoZGlhbG9nU2NvcGUpO1xyXG4gICAgICBkaXYuZGlhbG9nKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBPSzogZnVuY3Rpb24gKCkgeyAkKHRoaXMpLmRpYWxvZyhcImNsb3NlXCIpOyB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogdGl0bGVEaWFsb2dcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vc2VhcmNoXHJcbiAgICAkc2NvcGUuc2VhcmNoRm5jID0gKCkgPT4ge1xyXG4gICAgICBpZiAoJHNjb3BlLmlkID09IFwiXCIpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd1RlbXBsYXRlRGlhbG9nKFwiVGjDtG5nIGLDoW9cIiwgXCJIw6N5IG5o4bqtcCBJbnRlcm5zaGlwIElELlwiKVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MDgxL2dldGludGVybj9pZD0keyRzY29wZS5pZH1gXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcclxuICAgICAgICAgICRzY29wZS5uYW1lID0gcmVzcG9uc2UuZGF0YS5uYW1lO1xyXG4gICAgICAgICAgJHNjb3BlLmJpcnRoZGF5ID0gcmVzcG9uc2UuZGF0YS5iaXJ0aGRheTtcclxuICAgICAgICAgICRzY29wZS5nZXRJbkNvbXBhbnlEYXkgPSByZXNwb25zZS5kYXRhLmdldEluQ29tcGFueURheTtcclxuICAgICAgICAgICRzY29wZS5kaXNhYmxlZElkID0gdHJ1ZTtcclxuICAgICAgICAgICRzY29wZS5zaG93dXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICRzY29wZS5zaG93VGVtcGxhdGVEaWFsb2coXCJL4bq/dCBxdeG6oyB0w6xtIGtp4bq/bVwiLFxyXG4gICAgICAgICAgICBgSW5zZXJ0c2hpcCBJRDogJHskc2NvcGUuaWR9YCxcclxuICAgICAgICAgICAgYEluc2VydHNoaXAgbmFtZTogJHskc2NvcGUubmFtZX0gYCxcclxuICAgICAgICAgICAgYEludGVybnNoaXAgYmlydGhkYXk6ICR7JHNjb3BlLmJpcnRoZGF5fWBcclxuICAgICAgICAgIClcclxuICAgICAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2hvd1RlbXBsYXRlRGlhbG9nKFwiS+G6v3QgcXXhuqMgdMOsbSBraeG6v21cIiwgXCJLaMO0bmcgdMOsbSB0aOG6pXkga+G6v3QgcXXhuqMgbsOgby5cIilcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHVwZGF0ZSBcclxuICAgICRzY29wZS51cGRhdGVGbmMgPSAoKSA9PiB7XHJcbiAgICAgICRodHRwKHtcclxuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODEvdXBkYXRlaW50ZXJuJyxcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICdpZCc6ICRzY29wZS5pZCxcclxuICAgICAgICAgIFwibmFtZVwiOiAkc2NvcGUubmFtZSxcclxuICAgICAgICAgIFwiYmlydGhkYXlcIjogJHNjb3BlLmJpcnRoZGF5LFxyXG4gICAgICAgICAgXCJnZXRJbkNvbXBhbnlEYXlcIjogJHNjb3BlLmdldEluQ29tcGFueURheVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlIHRow6BuaCBjw7RuZy4uLi4uLi4uLi5hcGlcIik7XHJcbiAgICAgICAgICAkc2NvcGUuc2hvd1RlbXBsYXRlRGlhbG9nKFwiVGjDtG5nIGLDoW9cIiwgXCJVcGRhdGUgdGjDoG5oIGPDtG5nLlwiKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGFkdGUgbOG7l2kuLi4uLi4uLi4uYXBpXCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1RlbXBsYXRlRGlhbG9nKFwiVGjDtG5nIGLDoW9cIiwgXCJVcGRhdGUgdGjhuqV0IGLhuqFpLlwiKVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICB9KVxyXG5cclxuXHJcblxyXG59IiwiXHJcblxyXG5tb2R1bGUgYXBwIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuXHJcbiAgICBhbmd1bGFyTW9kdWxlLmNvbnRyb2xsZXIoJ2xvZ2luUGFnZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCAkcm9vdFNjb3BlLCBzdG9yZSkge1xyXG5cclxuICAgICAgICAkc2NvcGUuaWQgPSBcIlwiO1xyXG4gICAgICAgICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XHJcblxyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ2luRm5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9nZXRpbnRlcm4/aWQ9JHskc2NvcGUuaWR9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0TG9naW5OYW1lKHJlc3BvbnNlLmRhdGEubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRlOiBEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5Tm93ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRheUluQ29tcGFueSA9IG5ldyBEYXRlKHJlc3BvbnNlLmRhdGEuZ2V0SW5Db21wYW55RGF5KVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWZmRGF5cyA9IGRheU5vdyAtIGRheUluQ29tcGFueS5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGVFbmQgPSA2MCAtIGRpZmZEYXlzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXREYXRlRW5kKGRhdGVFbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5nw6B5IGhp4buHbiB04bqhaTogXCIgKyBkYXlOb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmfDoHkgdsOgbyBjdHk6IFwiICsgZGF5SW5Db21wYW55LmdldERhdGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJz4buRIG5nw6B5OiBcIiArIGRpZmZEYXlzKVxyXG5cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3N3b3JkID09IFwiYWRtaW5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tYWlucGFnZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdFUlI6IFdyb25nIElkIG9yIHBhc3dvcmRzJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9KVxyXG5cclxufSIsIm1vZHVsZSBhcHAge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG5cclxuXHJcbiAgICBhbmd1bGFyTW9kdWxlLmNvbnRyb2xsZXIoJ01haW5QYWdlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsICRyb290U2NvcGUsc3RvcmUpIHtcclxuXHJcbiAgICBcclxuICAgICAgICAkc2NvcGUuaW50ZXJuTmFtZT0gc3RvcmUuZ2V0TG9naW5OYW1lKCk7XHJcbiAgICAgICAgJHNjb3BlLmRhdGVFbmQgPSBzdG9yZS5nZXREYXRlRW5kKCk7XHJcbiAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSIsIm1vZHVsZSBhcHB7XHJcbiAgICBleHBvcnQgY2xhc3MgSW50ZXJuRHRve1xyXG4gICAgICAgIGludGVybklEOiBzdHJpbmc7XHJcbiAgICAgICAgaW50ZXJuTmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGludGVybkJpcnRoZGF5OiBzdHJpbmc7XHJcbiAgICAgICAgaW50ZXJuSW5Db21wYW55RGF5OiBzdHJpbmc7XHJcblxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihpbnRlcm5JRCxpbnRlcm5OYW1lLGludGVybkJpcnRoZGF5LGludGVybkluQ29tcGFueURheSkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVybklEID0gaW50ZXJuSUQ7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuTmFtZSA9IGludGVybk5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuQmlydGhkYXkgPSBpbnRlcm5CaXJ0aGRheTtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5JbkNvbXBhbnlEYXkgPSBpbnRlcm5JbkNvbXBhbnlEYXk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgIH1cclxufSIsIlxyXG5cclxubW9kdWxlIGFwcCB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyTW9kdWxlLnNlcnZpY2UoJ3N0b3JlJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxvZ2luTmFtZSA9ICcnO1xyXG4gICAgICAgIHZhciBkYXRlRW5kID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRMb2dpbk5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2dpbk5hbWVcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXREYXRlRW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZUVuZFxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9naW5OYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvZ2luTmFtZSA9IG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RGF0ZUVuZCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlRW5kID0gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59Il19
