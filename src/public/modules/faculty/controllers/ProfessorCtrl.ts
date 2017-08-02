module faculty {
'use strict'


export class ProfessorCtrl {

private coursesForSelf: core.ICourse[]=[];
private coursesForSemester: core.ICourse[]=[];
private currentSemester: core.ISemester;
private user: core.IUser;
private users: core.IUser[]=[];
private courseSections: core.ICourseSection[]=[];
private recommendations: core.IRecommendation[]=[];
private profilesForApps: core.IStudentProfile[]=[];
private selectedCourse: core.ICourse;
private recByCourse: core.IRecommendation[]=[];
private sections: core.ICourseSection[]=[];
private showDetails: boolean=false;
private TAList=[];

select(course: core.ICourse) {
var self=this;
this.selectedCourse=course;
this.getCourseSections(this.selectedCourse);
this.sections.forEach((sec) => {
self.getTAInfo(sec);
})
this.getApplications(this.selectedCourse);
this.getProfiles();
}

getCourseSections(course: core.ICourse) {
var list=[];
var self=this;
this.courseSections.forEach(function(courseS) {
if(courseS.eid==course.eid&&courseS.cid==course.cid) {
list.push(courseS);
}
});
this.sections=list;
return this.sections;
}

getApplications(course: core.ICourse) {
var list=[];
this.recommendations.forEach(function(rec) {
if(rec.cid==course.cid&&rec.eid==course.eid) {
list.push(rec);
}
});
this.recByCourse=list;
}

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
return l;
}

hasTakenCourse(app: core.IRecommendation) {
//this.getProfiles();
var self=this;
var list=this.profilesForApps;
var list2=[];
var list3=[];
var isTrue=false;

list.forEach(function(prof) {
if(prof.email==app.student) {
list2.push(prof);
}
});
var classes=list2[0].courseList;
var r=classes.split(";");
r.forEach(function(d) {
var f=d.split(":");
list3.push(f);
});
list3.forEach(function(z) {
if(z[0]==app.cid) {
isTrue=true;
}
});
return isTrue;
}

getRecommended(app: core.IRecommendation) {
var recommended=[];
var apps=this.Recommendations.getAll();
var list=this.Recommendations.getAllForStudent(app.student);
list.forEach(function(a) {
if(a.faculty!=""&&a.approved=="") {
recommended.push(a);
}
});
return recommended;
}

getAssigned(app: core.IRecommendation) {
var assigned=[];
var apps=this.Recommendations.getAll();
var list=this.Recommendations.getAllForStudent(app.student);
list.forEach(function(a) {
if(a.approved!="") {
assigned.push(a);
}
});
return assigned;
}

getTAInfo(courseS: core.ICourseSection) {
var list2=[];
var self=this;
var r=courseS.TAs.split(";");
r.forEach(function(ta) {
var t=ta.split(":");
var list=[];
self.users.filter((user) => {
if(user.email==t[0]&&t[0]!="") {
list.push(user.firstName+" "+user.lastName);
list.push(t[1]);
}
});
list2.push(list);
});
this.TAList[courseS.sid]=list2;
}

getProfiles() {
var list=[];
var user;
var profiles=this.StudentProfile;
var users=this.Users;
this.recByCourse.forEach(function(app) {
user=users.getUser(app.student);
list.push(profiles.getUserProfile(user[0])[0]);
});
this.profilesForApps=list;
}

recommend(app: core.IRecommendation) {
app.faculty=this.user.email;
this.Recommendations.update(app).then(() => {
this.Notify.info(app.student+"was recommended");
})
}

unRecommend(app: core.IRecommendation) {
app.faculty="";
this.Recommendations.update(app);
}

openStudentProfile(app: core.IRecommendation) {
var application=_.cloneDeep(app);
this.$mdDialog.show({
controller: StudentDetailCtrl,
controllerAs: 'cMod',
templateUrl: 'modules/faculty/views/studentProfileView.html',
locals: { app: application }
});
}


cancel() {
this.$mdDialog.cancel();
}

accept() {
this.$mdDialog.hide();
}
refresh() {
var self=this;
this.user=this.Auth.getLoggedInUser();
this.Semesters.refresh().then(() => {
self.currentSemester=self.Semesters.current()[0];
});
this.Courses.refresh().then(() => {
self.coursesForSelf=this.Courses.getCoursesForFaculty(self.user);
self.coursesForSemester=[];
self.coursesForSelf.forEach(function(c) {
if(c.eid==self.currentSemester.eid) {
self.coursesForSemester.push(c);
}
});
});
this.CourseSections.refresh().then(() => {
self.courseSections=self.CourseSections.getAll();
});
this.Recommendations.refresh().then(() => {
self.recommendations=self.Recommendations.getAll();
});
this.StudentProfile.refresh();
self.Users.refresh().then(() => {
self.users=self.Users.getStudents();
});
}

static $inject=['$mdSidenav','$mdDialog','Courses','CourseSections','StudentProfile','Recommendations','Notify','Auth','Users','Semesters'];

constructor(private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private Courses: core.Courses,
private CourseSections: core.CourseSections,
private StudentProfile: core.StudentProfile,
private Recommendations: core.Recommendations,
private Notify: core.Notify,
private Auth: core.Auth,
private Users: core.Users,
private Semesters: core.Semesters
) {
this.refresh();
}
}
}
