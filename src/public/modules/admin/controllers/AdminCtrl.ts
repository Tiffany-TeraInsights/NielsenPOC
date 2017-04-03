
/// <reference path="../../../../typings/index.d.ts"/>

module admin {
'use strict';

export class AdminCtrl {
private userName: string="t.dixon@ufl.edu"; // displayed name o the user
//private user: core.Auth
//private userName: string=this.user.email;
private state: string="admissions"; // code name of the state
private stateName: string; // displayed name of the state
private password: string; // password for the key uploaded
/**
* Method to update the displayed name of the state
*/
updateState() {
switch(this.state) {
case 'summary':
this.stateName="Summary";
break;
case 'students':
this.stateName="Student Management";
break;
case 'advisors':
this.stateName="Advisor Management";
break;
case 'faculty':
this.stateName='Faculty Management';
break;
case 'semesters':
this.stateName='Semester Management';
break;
}
}

constructor(private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private Auth: core.Auth) {
this.updateState();
}

/**
* Method to switch the view. Used by the menu system. Closes sidenav after finished
* @param {string} view The view to switch to
*/
selectView(view: string) {
this.state=view;
this.updateState();
this.$mdSidenav('left').close();
}

/** Method to open a menu. Called from view */
openMenu($mdOpenMenu,ev) {
$mdOpenMenu(ev);
};

/** Method to open sidenav. */
openSidenav() {
this.$mdSidenav('left').toggle();
}

/** Method to open about dialog, usually from logo on top bar */

/** Method to close a dialog */
closeDialog() {
this.$mdDialog.cancel();
}

// TODO: remove this method once we have proper public keys.
}



// Inject after
AdminCtrl.$inject=['$mdSidenav','$mdDialog','Auth'];
}
