/**
 * Admin default controller. Hooks up in the vain view.
 */
module admin {
'use strict';

export class FacultyCtrl {

private selectedType;
private faculties: core.IUser[]=[]; // listo of faculty
private facultyByEmail: { [email: string]: core.IUser }={};
private facultyNumber: number=0;
private selected: core.IUser;
private coursesForFaculty: core.ICourse[]=[];
private courseSections: core.ICourseSection[]=[];
private hello=[];
private separatedBRPD=[];
private courseSectionTimes;
private currentSemester;

public fOptions=[
{ type: "admin",name: "Administators" },
{ type: "professor",name: "Professors" },
{ type: "advisor",name: "Advisors" },
{ type: "hr",name: "Human Resources" }
];

refresh() {
var self=this;
this.Users.refresh().then(() => {
if(this.selectedType=='admin') {
self.faculties=self.Users.getAdmininstators();
}
else if(this.selectedType=='professor') {
self.faculties=self.Users.getProfessors();
}
else if(this.selectedType=='advisor') {
self.faculties=self.Users.getAdvisors();
}
else if(this.selectedType=='hr') {
self.faculties=self.Users.getHR();
}
else {
self.faculties=self.Users.getProfessors();
}
self.getNumberOfFaculty();
})
this.CourseSections.refresh().then(() => {
self.courseSections=this.CourseSections.getAll();
});
this.Semesters.refresh().then(() => {
self.currentSemester=this.Semesters.current()[0];
})
}

getNumberOfFaculty() {
this.facultyNumber=this.faculties.length;
}

getCoursesForFaculty(faculty: core.IUser) {
var self=this;
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
if(value1.cid==value2.cid&&value1.name==value2.cName&&value1.eid==value2.eid) {
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
private CourseSections: core.CourseSections,
private Semesters: core.Semesters) {
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
self.Users.update(newFaculty);
faculty.firstName=newFaculty.firstName;
faculty.lastName=newFaculty.lastName;
faculty.email=newFaculty.email;
faculty.roles=newFaculty.roles;
faculty.password=newFaculty.password;
} else { // add this semester to the list
console.log("State"+this);
newFaculty.password="password";
this.Users.add(newFaculty)
.then(() => {
self.faculties.push(newFaculty);
});
}
});
}

}

FacultyCtrl.$inject=['$mdDialog','Users','Notify','Courses','CourseSections','Semesters'];
}
