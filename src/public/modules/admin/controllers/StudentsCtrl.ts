
/// <reference path="../../../../typings/index.d.ts"/>

module admin {
'use strict';

export class StudentsCtrl {
private students: core.IUser[]=[];
private studentAmount;
private studentProfiles: core.IStudentProfile[]=[];
private apps: core.IRecommendation[]=[];
private selected: core.IUser;
private studentP: core.IStudentProfile;
private studentCourses;
private studentTests;
private studentDegrees;
private studentApps;

getStudents() {
this.Users.refresh().then(() => {
this.students=this.Users.getStudents();
this.studentAmount=this.students.length;
});
this.StudentProfile.refresh().then(() => {
this.studentProfiles=this.StudentProfile.getAll();
});
this.Recommondations.refresh().then(() => {
this.apps=this.Recommondations.getAll();
})

}

getInfoForStudent(student: core.IUser) {
this.selected=student;
this.studentP=this.StudentProfile.getUserProfile(this.selected)[0];
this.getUserCourses(this.studentP);
this.getUserDegrees(this.studentP);
this.getUserTests(this.studentP);
this.getCurrentApplications(this.studentP);
}

getUserDegrees(studentP: core.IStudentProfile) {
var list=[];
var l=[];
list=studentP.degrees.split(";");
list.forEach(function(deg) {
var d=deg.split(":");
l.push(d);
});
this.studentDegrees=l;
}

getUserCourses(studentP: core.IStudentProfile) {
var list=[];
var l=[];
list=studentP.courseList.split(";");
list.forEach(function(cour) {
var d=cour.split(":");
l.push(d);
});
this.studentCourses=l;
}

getUserTests(studentP: core.IStudentProfile) {
var list=[];
var l=[];
list=studentP.testScores.split(";");
list.forEach(function(test) {
var d=test.split(":");
l.push(d);
});
this.studentTests=l;
}

getCurrentApplications(studentP: core.IStudentProfile) {
var list=[];
list=this.apps.filter((rec) => {
return rec.student==studentP.email;
});
this.studentApps=list;
}

removeStudent(user: core.IUser) {
var currentStudent=_.cloneDeep(user);
this.$mdDialog.show({
controller: ConfirmationMsg,
controllerAs: 'cMod',
templateUrl: 'modules/admin/views/confirmation.html',
clickOutsideToClose: true,
locals: { student: currentStudent }
}).then(() => {
this.Users.remove(currentStudent);
this.getStudents();
})
}

getStudentProfile(student: core.IUser) {
return this.StudentProfile.getUserProfile(student)[0];
}

openStudentDialog(student: core.IUser) {
var newStudent=student? _.cloneDeep(student):<core.IUser>{ firstName: "",lastName: "",email: "",password: null,roles: "student",cid: "" };
var self=this;
this.$mdDialog.show({
controller: AddStudentsCtrl,
controllerAs: 'cMod', // name of the modal controller
templateUrl: 'modules/admin/views/addStudents.html',
clickOutsideToClose: true,
locals: { student: newStudent }
}).then(() => {
// is this a new student?
if(student) { // copy edited semester back into semester
newStudent.roles='student';
self.Users.update(newStudent);
student.firstName=newStudent.firstName;
student.lastName=newStudent.lastName;
student.email=newStudent.email;
student.password=newStudent.password;
} else { // add this semester to the list
console.log("State"+this);
this.Users.add(newStudent)
.then(() => {
self.students.push(newStudent);
});
}
});
}

static $inject=['$mdDialog','$timeout','Users','Auth','StudentProfile','Recommendations'];


constructor(private $mdDialog: ng.material.IDialogService,
private $timeout: angular.ITimeoutService,
private Users: core.Users,
private Auth: core.Auth,
private StudentProfile: core.StudentProfile,
private Recommondations: core.Recommendations
) {
//this.refresh();
this.getStudents();
}
}
}
