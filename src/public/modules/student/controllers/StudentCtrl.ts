/// <reference path="../../../../typings/index.d.ts"/>

module student {
'use strict'


export class StudentCtrl {
private state: string="studentProfile";
private stateName: string;
private user: core.IUser;


updateState() {
this.user=this.Auth.getLoggedInUser();
switch(this.state) {
case 'studentProfile':
this.stateName="Profile";
break;

case 'taApps':
this.stateName="TA Applications";
break;
}
}


selectView(view: string) {
this.user=this.Auth.getLoggedInUser();
this.state=view;
this.updateState();
this.$mdSidenav('left').isLockedOpen();
}


constructor(
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify
) {
this.user=this.Auth.getLoggedInUser();
this.updateState();

}

}

StudentCtrl.$inject=['$mdSidenav','$mdDialog','$http','Auth','Notify'];

}
