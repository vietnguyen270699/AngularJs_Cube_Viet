

module app {
  'use strict'

  angularModule.controller('editPageController', function ($scope, $location, $http, $rootScope, $compile) {

    $scope.showupdate = false
    $scope.disabledId = false
    $scope.id = ""
    $scope.name = ""
    $scope.birthday = ''
    $scope.getInCompanyDay = ''


    //show dialog
    $scope.showTemplateDialog = function (title = "alert", mess = "", mess2 = "", mess3 = "", mess4 = "") {
      var content = $scope.$new();
      var titleDialog = title;
      content.message = mess;
      content.message2 = mess2;
      content.message3 = mess3;
      content.message4 = mess4;
      $scope.showDialog(content, "dialogTemplate", titleDialog)
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
    }


    //search
    $scope.searchFnc = () => {
      if ($scope.id == "") {
        $scope.showTemplateDialog("Thông báo", "Hãy nhập Internship ID.")
      }else{
        $http({
          method: 'GET',
          url: `http://localhost:8081/getintern?id=${$scope.id}`
        }).then(function successCallback(response) {
          $scope.name = response.data.name;
          $scope.birthday = response.data.birthday;
          $scope.getInCompanyDay = response.data.getInCompanyDay;
          $scope.disabledId = true;
          $scope.showupdate = true;
          $scope.showTemplateDialog("Kết quả tìm kiếm",
            `Insertship ID: ${$scope.id}`,
            `Insertship name: ${$scope.name} `,
            `Internship birthday: ${$scope.birthday}`
          )
        }, function errorCallback(response) {
          $scope.showTemplateDialog("Kết quả tìm kiếm", "Không tìm thấy kết quả nào.")

        });

      }
    };

    // update 
    $scope.updateFnc = () => {
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
          $scope.showTemplateDialog("Thông báo", "Update thành công.")
        },
          function (response) {
            console.log("upadte lỗi..........api");
            $scope.showTemplateDialog("Thông báo", "Update thất bại.")
          });


    }
  })



}