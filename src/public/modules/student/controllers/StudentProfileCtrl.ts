
/// <reference path="../../../../typings/index.d.ts"/>

module student {
'use strict'


export class StudentProfileCtrl {

public studentTypes=[
{ type: "Undergraduate" },
{ type: "Graduate" },
{ type: "PhD Candidate" }
];
/*private state: string="summary";
//private stateName: string;

private user: core.IUser;

getUser() {
this.user=this.Auth.getLoggedInUser();
}

updateState() {
switch(this.state) {
case 'summary':
this.stateName="Student Summary";
break;
}
}

selectView(view: string) {
this.state=view;
this.updateState();
this.$mdSidenav('left').isLockedOpen();
}
*/

accept() {
this.$mdDialog.hide();
}

cancel() {
this.$mdDialog.cancel();
}

static $inject=['studentProfile','$mdSidenav','$mdDialog','$http','Auth','Notify'];

constructor(private studentProfile: core.IStudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify,
) {
//this.updateState();
//this.getUser();
//this.$mdSidenav('left').isOpen();
//this.user=new core.UserInfo();
}

}


}
