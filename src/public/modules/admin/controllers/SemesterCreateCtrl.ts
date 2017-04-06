
module admin {
'use strict';

export class SemesterCreateCtrl {
private course: core.ICourse; // the current list of courses
private courseSection: core.ICourseSection;
private editingC=false; // are we editing a course?
private courseList: core.ICourse[]=[];

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
this.course.eid=this.semester.eid;
this.courseList.push(this.course);
this.Courses.addCourse(this.course)
.then(() => {
this.courses.push(this.course);
});
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
if(value.cid==self.course.cid) {
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

import(file: any) {
var self=this;
csvFileReader(file,(data: string) => {
this.bulkCourses=data;
for(var i=0;i<data.length;++i) {
if(data[i][0]!="") {
self.course=<core.ICourse>{ cid: "",eid: "",name: "",sections: "",credits: 0,exam: "",cf: null,eep: null,wm: null,ge: null,enrollment: 0,professor1: "",professor2: "" };
self.courseSection=<core.ICourseSection>{ sid: "",cid: "",eid: "",BRPD: "",enrollment: 0,TAs: "" };
self.course.eid=this.semester.eid;
self.courseSection.eid=this.semester.eid;
self.course.cid=data[i][0];
if(this.doesCourseExist()==true) {
self.courseSection.cid=data[i][0];
self.courseSection.sid=data[i][5];
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
self.courseSection.sid=data[i][5];
self.course.credits=parseInt(data[i][6]);
self.courseSection.BRPD=data[i][9]+":"+data[i][10]+":"+data[i][8]+":"+data[i][7];
self.course.exam=data[i][11];
self.course.name=data[i][12];
self.course.professor1=data[i][13];
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
private bulkCourses: string) {
this.course=<core.ICourse>{ cid: "",eid: "",name: "",sections: "",credits: 0,exam: "",cf: "",eep: false,wm: "",ge: "",enrollment: 0,professor1: "",professor2: "" };
this.courseSection=<core.ICourseSection>{ sid: "",cid: "",eid: "",BRPD: "",enrollment: 0,TAs: "" };
}
}

SemesterCreateCtrl.$inject=['$mdDialog','Users','$timeout','semester','Courses','CourseSections'];
}
