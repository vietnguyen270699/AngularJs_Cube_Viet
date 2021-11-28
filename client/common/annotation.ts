module app {
    'use strict';
    export let templateUrlBase = './client/views';

    export function Controller(name: string) {
        return function (clazz: any) {
            clazz.$name = name;
            angularModule.controller(name, clazz)
        }
    }
    export function Directive(directive: any) {
        return function (clazz: any) {
            angularModule.directive(directive.name, function () {
                directive.controller = clazz;
                if (directive.templateUrl) {
                    directive.templateUrl = templateUrlBase + directive.templateUrl;
                }
                directive.controllerAs = 'vm';

                if (directive.bindToController) {
                    directive.scope = {}
                }
                return directive
            })
        }

    }
}