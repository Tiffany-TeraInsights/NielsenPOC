
/// <reference path="../../../../typings/index.d.ts"/>

module student {
'use strict'


export class StudentProfileCtrl {

public studentTypes=[
{ type: "Undergraduate" },
{ type: "Graduate" },
{ type: "PhD Candidate" }
];

public degreeTypes=[
{ type: "Associate" },
{ type: "Bachelor" },
{ type: "Master" },
{ type: "Doctorate" }
];

public testTypes=[
{ type: "SAT" },
{ type: "ACT" },
{ type: "GRE" },
{ type: "TOEFL" },
{ type: "LSAT" },
{ type: "MCAT" },
{ type: "GMAT" },
{ type: "DAT" },
{ type: "PCAT" },
{ type: "OAT" }
];

public grades=[
{ grade: "A" },{ grade: "A-" },{ grade: "B+" },{ grade: "B" },{ grade: "B-" },{ grade: "C+" },{ grade: "C" },{ grade: "Lower than a C" }
];

private user: core.IUser;
private firstName;
private lastName;
private CourseList: core.ICourse[]=[];
private individualCourse: string=null;
private individualGrade: string=null;
private individualDegree: string=null;
private individualDL: string=null;
private testType: string=null;
private testScore: string=null;
private cl=[];
private dl=[];
private tl=[];
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

appendCourseList() {
this.studentProfile.courseList=this.studentProfile.courseList+this.individualCourse+":"+this.individualGrade+";";
this.getCourseList();
}

updateCourseList() {
var list=this.studentProfile.courseList;
this.cl.forEach(function(v) {
list=list+v[0]+":"+v[1]+";"
});
this.studentProfile.courseList=list;
}

getCourseList() {
this.cl=[];
var result=this.studentProfile.courseList.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
this.cl=separate;
}

deleteCourse(course: string[]) {
var oldList=this.cl;
this.cl.forEach(function(val,index) {
if(course==val) {
oldList.splice(index,1);
}
});
this.cl=oldList;
this.studentProfile.courseList="";
this.updateCourseList();
this.getCourseList();
}

getDegreeList() {
this.dl=[];
var result=this.studentProfile.degrees.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
this.dl=separate;
}

deleteDegree(degree: string[]) {
var oldList=this.dl;
this.dl.forEach(function(val,index) {
if(degree==val) {
oldList.splice(index,1);
}
});
this.dl=oldList;
this.studentProfile.degrees="";
this.upgradeDegreeList();
this.getDegreeList();
}

addDegree() {
this.studentProfile.degrees=this.studentProfile.degrees+this.individualDL+":"+this.individualDegree+";";
this.getDegreeList();
}

upgradeDegreeList() {
var list=this.studentProfile.degrees;
this.dl.forEach(function(v) {
list=list+v[0]+":"+v[1]+";"
});
this.studentProfile.degrees=list;
}

getTestList() {
this.tl=[];
var result=this.studentProfile.testScores.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
this.tl=separate;
}

addTest() {
this.studentProfile.testScores=this.studentProfile.testScores+this.testType+":"+this.testScore+";";
this.getTestList();
}

deleteTest(test: string[]) {
var oldList=this.tl;
this.tl.forEach(function(val,index) {
if(test==val) {
oldList.splice(index,1);
}
});
this.tl=oldList;
this.studentProfile.testScores="";
this.updateTestList();
this.getTestList();
}

updateTestList() {
var list=this.studentProfile.testScores;
this.tl.forEach(function(v) {
list=list+v[0]+":"+v[1]+";"
});
this.studentProfile.testScores=list;
}

refresh() {
this.Courses.refresh().then((courses: Array<core.ICourse>) => {
this.CourseList=courses;
var cl=[];
var cl2=[];
var cl3=[];
cl=this.CourseList;
cl.forEach(function(v) {
if(cl2.indexOf(v.cid)!=(-1)) {
console.log("Yo");
}
else {
cl2.push(v.cid);
cl3.push(v);
}
});
this.CourseList=cl3;
});
this.getCourseList();
this.getDegreeList();
this.user=this.Auth.getLoggedInUser();
this.firstName=this.user.firstName;
this.lastName=this.user.lastName;
}

static $inject=['studentProfile','$mdSidenav','$mdDialog','$http','Auth','Notify','Courses'];

constructor(private studentProfile: core.IStudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify,
private Courses: core.Courses
) {
this.refresh();
//this.getUser();
//this.$mdSidenav('left').isOpen();
//this.user=new core.UserInfo();
}

}


}
