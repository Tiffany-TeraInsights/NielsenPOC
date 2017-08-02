module admin {
'use strict'


export class AddStudentsCtrl {

private newStudent: core.IUser;
private csvSlot: number=0;


accept() {
this.$mdDialog.hide();
}

cancel() {
this.$mdDialog.cancel();
}


constructor(private $mdDialog: ng.material.IDialogService,
private student: core.IUser,
private Users: core.Users) {
this.newStudent=<core.IUser>{ firstName: "",lastName: "",email: "",password: "",roles: "",cid: null };
}


}

AddStudentsCtrl.$inject=['$mdDialog','student','Users'];

}
