/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';


    /**
     * This controllers manages the login process
     * 
     * @export
     * @class LoginCtrl
     */
    export class LoginCtrl {
        private challengeInfo: any;
        private URL: string; // the URL we need to render in iframes

        // Skip past signup phases
        login(username: string, password: string) {
            var that = this;
            that.Auth.login(username,password)
                .then(() => {
                    console.log("Logged in");
                    that.$state.go("todos");
                    that.Notify.info('Login Successful');
                }, (error) => {
                    console.log("Logged failed: ", error);
                    that.$state.go("login");
                    that.Notify.error('Login Failed. ' + error.statusText);
                });
        }

        static $inject = ['$sce', 'Notify', 'Auth', '$state'];

        constructor(
            private $sce: ng.ISCEService,
            private Notify: Notify,
            private Auth: Auth,
            private $state: angular.ui.IStateService
        ) {
            this.$state.go('login.main');
        }
    }
}
