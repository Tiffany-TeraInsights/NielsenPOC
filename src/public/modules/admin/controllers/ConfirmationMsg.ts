module admin {
'use strict'


export class ConfirmationMsg {



accept() {
this.$mdDialog.hide();
}

cancel() {
this.$mdDialog.cancel();
}

static $inject=['$mdDialog','student'];

constructor(private $mdDialog: ng.material.IDialogService,
private student: core.IUser) {

}


}

}
