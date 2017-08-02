module admin {
'use strict'


export class StudentDetailCtrl {

private degrees=[];
private tests=[];
private courses=[];

getUserName(app: core.IRecommendation): string {
var users=this.Users;
var list;
list=(this.Users.getUser(app.student)[0]);
return list.firstName+" "+list.lastName;
}

getUserType(app: core.IRecommendation): string {
var users=this.Users;
var list;
var user: core.IUser;
user=(this.Users.getUser(app.student)[0]);
list=this.StudentProfile.getUserProfile(user)[0];
return list.studentType;
}

getUserGPA(app: core.IRecommendation) {
var users=this.Users;
var list;
var user: core.IUser;
user=(this.Users.getUser(app.student)[0]);
list=this.StudentProfile.getUserProfile(user)[0];
return list.GPA;
}

getUserDegrees(app: core.IRecommendation) {
var users=this.Users;
var list: core.IStudentProfile;;
var degree=[];
var l=[];
var user: core.IUser;
user=(this.Users.getUser(app.student)[0]);
list=this.StudentProfile.getUserProfile(user)[0];
degree=list.degrees.split(";");
degree.forEach(function(deg) {
var d=deg.split(":");
l.push(d);
});
this.degrees=l;
}

getUserTests(app: core.IRecommendation) {
var users=this.Users;
var list: core.IStudentProfile;;
var degree=[];
var l=[];
var user: core.IUser;
user=(this.Users.getUser(app.student)[0]);
list=this.StudentProfile.getUserProfile(user)[0];
degree=list.testScores.split(";");
degree.forEach(function(deg) {
var d=deg.split(":");
l.push(d);
});
this.tests=l;
}

getUserCourses(app: core.IRecommendation) {
var users=this.Users;
var list: core.IStudentProfile;;
var degree=[];
var l=[];
var user: core.IUser;
user=(this.Users.getUser(app.student)[0]);
list=this.StudentProfile.getUserProfile(user)[0];
degree=list.courseList.split(";");
degree.forEach(function(deg) {
var d=deg.split(":");
l.push(d);
});
this.courses=l;
}

accept() {
this.$mdDialog.hide();

}



static $inject=['$mdDialog','Users','StudentProfile','app'];

constructor(private $mdDialog: ng.material.IDialogService,
private Users: core.Users,
private StudentProfile: core.StudentProfile,
private app: core.IRecommendation
) {
this.getUserDegrees(app);
this.getUserCourses(app);
this.getUserTests(app);
}
}
}
