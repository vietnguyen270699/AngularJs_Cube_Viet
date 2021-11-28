

module app {
    'use strict'

    angularModule.service('store', function () {


        var loginName = '';
        var dateEnd = 0;

        this.getLoginName = function () {
            return loginName
        }
        this.getDateEnd = function () {
            return dateEnd
        }


        this.setLoginName = function (name) {
            return loginName = name;
        }
        this.setDateEnd = function (date) {
            return dateEnd = date;
        }
    })
}