
module admin {
'use strict';

export class SemesterCreateCtrl {
private course: core.ICourse; // the current list of courses
private courseSection: core.ICourseSection;
private editingC=false; // are we editing a course?
private courseList: core.ICourse[]=[];
private facultyList: core.IUser[]=[];

private editorOptions={
lineWrapping: true,
lineNumbers: true,
mode: 'markdown'
};

private courses: core.ICourse[]=[]; // list of faculty
private courseSections: core.ICourseSection[]=[];

/**
* Print the list of faculty in a region 
* @param {core.IRegion} region The region to apply to
*/

addCourse() {
if(this.course.cid!=(undefined||"")&&this.course.name!=(undefined||"")&&this.course.professors!=(undefined||"")) {
if(this.editingC==false) {
this.course.eid=this.semester.eid;
this.courseList.push(this.course);
this.Courses.addCourse(this.course)
.then(() => {
this.courses.push(this.course);
});
this.course=<core.ICourse>{};
}
else {
this.course.eid=this.semester.eid;
this.Courses.updateCourse(this.course);
this.editingC=false;
this.course=<core.ICourse>{};
}
}
else {
this.Notify.info("Please fill in all of the required fields");
}
}

isValid() {
if(this.course.cid!=(undefined||"")&&this.course.name!=(undefined||"")&&this.course.professors!=(undefined||"")) {
return true;
}
else {
return false;
}
}

updateCourse() {
this.Courses.updateCourse(this.course)
.then(() => {
console.log("Course updated");
})
}

addSection() {
this.courseSection.eid=this.semester.eid;
this.CourseSections.addCourseSection(this.courseSection)
.then(() => {
this.courseSections.push(this.courseSection);
})
}

updateSection() {
this.courseSection.eid=this.semester.eid;
this.CourseSections.updateCourseSection(this.courseSection)
.then(() => {
console.log("Course Section Updated");
})
}


doesCourseExist() {
var self=this;
self.courseList.forEach(function(value) {
if(value.id==self.course.id) {
return true;
}
});
return false;
}

listCoursesForSemester() {
this.Courses.getAllCourses(this.semester.eid)
.then(
(c) => {
console.log("List courses for semester + "+c);
},(err) => {
console.log(err);
});
}

listFaculty() {
this.Users.refresh().then(() => {
this.facultyList=this.Users.getProfessors();
});
}

assignFaculty(fac: string) {
var sp=fac.split("");
var lastN="";
var prof=fac;
for(var i=1;i<sp.length;++i) {
lastN=lastN+sp[i];
}
this.facultyList.forEach(function(f) {
if(lastN==f.lastName) {
prof=f.firstName+" "+f.lastName;
}
});
return prof;
}

getCourseID(data) {
var s=this.semester.eid;
var r=data[0].split(" ");
r.forEach(function(d) {
s=s+d;
});

var c=data[12].split(" ");
c.forEach(function(x) {
s=s+x;
});
return s;
}

getCourseSectionID(data) {
//data[i][0]+data[i][5]+data[0][12]
var s="";

var r=data[0].split(" ");
r.forEach(function(d) {
s=s+d;
});

s=s+data[5];

var c=data[12].split(" ");
c.forEach(function(x) {
s=s+x;
});

return s;

}

/* 
The course ID will be semester id + course code (cid) + course name
The section ID will be cid + sid + course name
*/

import(file: any) {
var self=this;
csvFileReader(file,(data: string) => {
this.bulkCourses=data;
for(var i=0;i<data.length;++i) {

if(data[i][0]!="") {
self.course=<core.ICourse>{ id: "",cid: "",eid: "",name: "",sections: "",credits: 0,exam: "",cf: null,eep: null,wm: null,ge: null,enrollment: 0,professors: "" };
self.courseSection=<core.ICourseSection>{ id: "",sid: "",cid: "",eid: "",BRPD: "",enrollment: 0,TAs: "" };
self.course.id=self.getCourseID(data[i]);
self.course.eid=this.semester.eid;
self.courseSection.eid=this.semester.eid;
self.course.cid=data[i][0];
if(this.doesCourseExist()==true) {
self.courseSection.id=self.getCourseSectionID(data[i]);
self.courseSection.cid=data[i][0];
self.courseSection.sid=data[i][5];
self.courseSection.cName=data[i][12];
self.courseSection.id=data[i][0]+data[i][5]+data[0][12];
self.courseSection.BRPD=data[i][9]+":"+data[i][10]+":"+data[i][8]+":"+data[i][7];
self.courseSection.enrollment=0;
self.courseSection.TAs="";
self.course.sections=self.course.sections+";"+data[i][5];
self.updateCourse();
self.addSection();
}
else {
self.courseSection.cid=data[i][0];
self.course.cf=data[i][1];
if(data[i][2]=='Y'||'y') {
self.course.eep=true;
}
else {
self.course.eep=false;
}
self.course.wm=data[i][3];
self.course.ge=data[i][4];
if(self.course.sections=="") {
self.course.sections=data[i][5];
}
else {
self.course.sections=self.course.sections+";"+data[i][5];
}
self.courseSection.id=self.getCourseSectionID(data[i]);
self.courseSection.sid=data[i][5];
self.courseSection.cName=data[i][12];
self.course.credits=parseInt(data[i][6]);
self.courseSection.BRPD=data[i][9]+":"+data[i][10]+":"+data[i][8]+":"+data[i][7];
self.course.exam=data[i][11];
self.course.name=data[i][12];
self.course.professors=this.assignFaculty(data[i][13]);
self.courseSection.enrollment=0;
self.courseSection.TAs="";
self.addCourse();
self.addSection();
}
}
else {
self.courseSection.BRPD=self.courseSection.BRPD+";"+data[i][9]+":"+data[i][10]+":"+data[i][8]+":"+data[i][7];
self.updateSection();
}
}
})
}
/**
* Accept function. Closes modal
*/
accept() {
console.log(this.semester.eid,this.semester.name,this.semester.admin);
// no need to pass the semester since calee has it.
this.$mdDialog.hide();
}

/**
* Cancel all the actions
*/
cancel() {
this.$mdDialog.cancel();
}

clone(sem: core.ISemester) {

}

coursesBySemester(semester: core.ISemester) {
let courseL=[];
this.courses.forEach(function(value) {
if(value.eid==semester.eid) {
courseL.push(value);
}
});
this.courseList=courseL;
}

refresh() {
this.Courses.refresh().then(() => {
this.courses=this.Courses.getAll();
this.coursesBySemester(this.semester);
});
}

/**
* Constructor
* @param {ng.material.IDialogService} private $mdDialog Service
* @param {ISemester}                  private semester  The semester info (different if new)
*/
constructor(private $mdDialog: ng.material.IDialogService,
private Users: core.Users,
private $timeout: ng.ITimeoutService,
private semester: core.ISemester,
private Courses: core.Courses,
private CourseSections: core.CourseSections,
private bulkCourses: string,
private Notify: core.Notify) {
this.course=<core.ICourse>{ id: "",cid: "",eid: "",name: "",sections: "",credits: 0,exam: "",cf: "",eep: false,wm: "",ge: "",enrollment: 0,professors: "" };
this.courseSection=<core.ICourseSection>{ id: "",sid: "",cid: "",eid: "",BRPD: "",enrollment: 0,TAs: "" };
this.listFaculty();
this.refresh();
}
}

SemesterCreateCtrl.$inject=['$mdDialog','Users','$timeout','semester','Courses','CourseSections','Notify'];
}
