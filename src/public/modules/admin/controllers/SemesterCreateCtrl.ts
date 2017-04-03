
module admin {
'use strict';

export class SemesterCreateCtrl {
private course: core.ICourse; // the current list of courses
private editingC=false; // are we editing a course?

private editorOptions={
lineWrapping: true,
lineNumbers: true,
mode: 'markdown'
};

private courses: core.ICourse[]=[]; // list of faculty


/**
* Print the list of faculty in a region 
* @param {core.IRegion} region The region to apply to
*/

addCourse() {
this.course.eid=this.semester.eid;
this.Courses.addCourse(this.course)
.then(() => {
this.courses.push(this.course);
});
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
self.course.eid=this.semester.eid;
self.course.cid=data[i][0];
self.course.name=data[i][12];
self.course.professor1=data[i][13];
self.addCourse();
self.course=<core.ICourse>{};
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
private bulkCourses: string) {
this.course=<core.ICourse>{ cid: "",eid: "",name: "",enrollment: 0,professor1: "",professor2: "" };
}
}

SemesterCreateCtrl.$inject=['$mdDialog','Users','$timeout','semester','Courses'];
}
