/**
 * Admin default controller. Hooks up in the vain view.
 */
module admin {
'use strict';

export class FacultyCtrl {

private faculties: core.IUser[]=[]; // listo of faculty
private facultyByEmail: { [email: string]: core.IUser }={};
private facultyNumber: number=0;

refresh() {
var self=this;
this.Users.refresh().then(() => {
self.faculties=self.Users.getFaculty();
self.getNumberOfFaculty();
})
}

getNumberOfFaculty() {
this.facultyNumber=this.faculties.length;
}


constructor(private $mdDialog: ng.material.IDialogService,
private Users: core.Users,
private Notify: core.Notify) {
this.refresh();
}

openFacultyDialog(faculty: core.IUser) {
var newFaculty=faculty? _.cloneDeep(faculty):<core.IUser>{ firstName: "",lastName: "",email: "",password: null,roles: "faculty",cid: "" };
var self=this;
this.$mdDialog.show({
controller: AddFacultyCtrl,
controllerAs: 'cMod', // name of the modal controller
templateUrl: 'modules/admin/views/AddFaculty.html',
clickOutsideToClose: true,
locals: { faculty: newFaculty }
}).then(() => {
// is this a new faculty?
if(faculty) { // copy edited semester back into semester
newFaculty.roles='faculty';
self.Users.update(newFaculty);
faculty.firstName=newFaculty.firstName;
faculty.lastName=newFaculty.lastName;
faculty.email=newFaculty.email;
faculty.password=newFaculty.password;
} else { // add this semester to the list
console.log("State"+this);
this.Users.add(newFaculty)
.then(() => {
self.faculties.push(newFaculty);
});
}
});
}

}

FacultyCtrl.$inject=['$mdDialog','Users','Notify'];
}
