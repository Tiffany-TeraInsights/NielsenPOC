/// <reference path="../../typings/index.d.ts" />
/// <reference path="../core/controllers/RegisterCtrl.ts" />
/// <reference path="../core/controllers/LoginCtrl.ts" />


/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module core {
    'use strict';

    var core = angular.module('2Q2R', ['ngAria', 'ui.materialize',
        'ngResource', 'ui.router', 'ct.ui.router.extras',
        'ngMessages', 'validation.match', 'ngDropdown', 'ja.qr'])
        .service('Auth', Auth)
        .service('Notify', Notify)
        .controller('RegisterCtrl', RegisterCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .config((
            $stateProvider: angular.ui.IStateProvider,
            $urlRouterProvider: angular.ui.IUrlRouterProvider
        ) => {
            $urlRouterProvider.otherwise("/register");
            $stateProvider
                .state('register', {
                    url: "/register",
                    template: "<ui-view />",
                    controller: 'RegisterCtrl',
                    controllerAs: "ctrl",
                    deepStateRedirect: {
                        default: { state: 'register.main' }
                    }
                })
                .state('register.main', {
                    url: '',
                    templateUrl: "core/views/register.html",

                })
                .state('register.return', {
                    url: "/return",
                    templateUrl: "core/views/register.return.html"
                })
                .state('login', {
                    url: "/login",
                    template: "<ui-view />",
                    controller: "LoginCtrl",
                    controllerAs: "ctrl",
                    deepStateRedirect: {
                        default: { state: 'login.main' },
                        fn: ($dsr$) => {
                            return { state: 'login.main' };
                        }
                    }
                })
                .state('login.main', {
                    url: '',
                    templateUrl: "core/views/login.html"
                })
                .state('todos', {
                    url: "/adminMain",
                    templateUrl: "admin/views/admin-main.html",
                    controller: "TodoCtrl",
                    controllerAs: "ctrl"
                })
                ;
        })
        ;
}
