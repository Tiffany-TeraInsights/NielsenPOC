/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class RegisterCtrl {
        private URL: string; // the URL we need to render in iframes
        private challengeInfo: any;

        signup(username: string, password: string) {

            this.Auth.register(username, password)
                .then(() => {
                    this.$state.go("register.return");
                    this.Notify.info('Registration Successful');
                }, () => {
                    this.$state.go("register");
                    this.Notify.error('Registration Failed');
                });
            (err) => {
                console.log("Sign up failed: ", err);
                this.Notify.error("Registration Failed. " + err.data);
            };
        }
        static $inject = ['$sce', 'Notify', 'Auth', '$state'];

        constructor(
            private $sce: ng.ISCEService,
            private Notify: Notify,
            private Auth: Auth,
            private $state: angular.ui.IStateService
        ) {
            this.$state.go('register.main');
        }

    }
}
