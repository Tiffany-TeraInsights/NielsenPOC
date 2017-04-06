/**
 * Admin default controller. Hooks up in the vain view.
 */
module admin {
'use strict';

export class FacultyCtrl {

private faculties: core.IUser[]=[]; // listo of faculty
private facultyByEmail: { [email: string]: core.IUser }={};
private facultyNumber: number=0;
private selected: core.IUser;
private coursesForFaculty: core.ICourse[]=[];
private courseSections: core.ICourseSection[]=[];
private hello=[];
private separatedBRPD=[];

refresh() {
var self=this;
this.Users.refresh().then(() => {
self.faculties=self.Users.getFaculty();
self.getNumberOfFaculty();
})
this.CourseSections.refresh().then(() => {
self.courseSections=this.CourseSections.getAll();
})
}

getNumberOfFaculty() {
this.facultyNumber=this.faculties.length;
}

getCoursesForFaculty(faculty: core.IUser) {
this.selected=faculty;
this.coursesForFaculty=[];
this.hello=[];
var sectionsForCourse=[];
var hey=[];
this.Courses.refresh().then(() => {
this.coursesForFaculty=this.Courses.getCoursesForFaculty(this.selected);
var allCourseSections=this.CourseSections.getAll();
this.coursesForFaculty.forEach(function(value1) {
allCourseSections.forEach(function(value2) {
if(value1.cid==value2.cid) {
sectionsForCourse.push(value2);
}
});
hey[value1.cid]=sectionsForCourse;
sectionsForCourse=[];
});
this.hello=hey;
});

}

getCourseSectionTimes(data: string): string[] {
var result=data.split(";");
var separate=[];
var normal: string="";
result.forEach(function(value) {
var r=value.split(":");
normal="";
r.forEach(function(v) {
normal=normal+v+"   ";
});
separate.push(normal);
});
return separate;
}


constructor(private $mdDialog: ng.material.IDialogService,
private Users: core.Users,
private Notify: core.Notify,
private Courses: core.Courses,
private CourseSections: core.CourseSections) {
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

FacultyCtrl.$inject=['$mdDialog','Users','Notify','Courses','CourseSections'];
}
