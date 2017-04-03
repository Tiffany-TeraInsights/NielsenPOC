
/// <reference path="../../../../typings/index.d.ts"/>


module admin {
'use strict';

export class SemesterCtrl {
private newSemester: core.ISemester;
private semesters: core.ISemester[]=[];
private courses: core.ICourse[]=[];
private coursesBySem: core.ICourse[]=[];
private course: core.ICourse;
private semestersByID: { [eid: string]: core.ISemester }={};
private current: core.ISemester;
private activeEid: string;
private faculty: core.IUser[]=[];
private refreshing=false;

/*setCurrent(semester: core.ISemester) {
this.Semesters.setCurrent(semester.eid);
this.activeEid=semester.eid;
} */

setCurrent(semester: core.ISemester) {
this.activeEid=semester.eid;
console.log("Current Semester set to ",semester.eid);
}

select(semester: core.ISemester) {
this.current=semester;
this.coursesBySemester(this.current);
}

addSemester() {
if(this.newSemester.name||this.newSemester.eid==null) {
console.log("Semester must have name and eid");
}
else {
this.Semesters.add(this.newSemester);
this.semesters.push(this.newSemester);
}
}

coursesBySemester(semester: core.ISemester) {
let courseList=[];
this.courses.forEach(function(value) {
if(value.eid==semester.eid) {
courseList.push(value);
}
});
this.coursesBySem=courseList;
}


/*createSemester(name: string,eid: string,admin: string,current: boolean) {
this.Semesters.addSemester(name,eid,admin,current)
}*/

openAddEditDialog(semester: core.ISemester) {
// create (if not given) or deep copy the semester
var newSemester=semester? _.cloneDeep(semester):
<core.ISemester>{ eid: "",name: "",admin: "",current: false };
var that=this;

that.$mdDialog.show({
controller: SemesterCreateCtrl,
controllerAs: 'cMod',
templateUrl: 'modules/admin/views/SemesterCreate.html',
clickOutsideToClose: true,
locals: { semester: newSemester }
}).then(() => {
// is this a new semester?
if(semester) { // copy edited semester back into semester
that.Semesters.update(newSemester);
semester.name=newSemester.name;
semester.eid=newSemester.eid;
semester.admin=newSemester.admin;
semester.current=newSemester.current;

} else { // add this semester to the list
console.log("State"+this);
newSemester.admin=this.Auth.user.lastName;
that.Semesters.add(newSemester)
.then(() => {
that.semesters.push(newSemester);
});
}
});
}

refresh() {
var self=this;
this.refreshing=true;
this.Semesters.refresh().then((semesters: Array<core.ISemester>) => {
self.semesters=semesters;
self.activeEid=self.Semesters.current().eid;
})
this.Courses.refresh().then((courses: Array<core.ICourse>) => {
self.courses=courses;
})
.then(() => {
// let it spin for 1/2 more second
self.$timeout(() => { this.refreshing=false; },1000);
});
}

closeDialog() {
this.$mdDialog.hide();
}

acceptDialog() {
//add code to finalize semester addition
this.$mdDialog.hide();
}


constructor(private $mdDialog: ng.material.IDialogService,
private Semesters: core.Semesters,
private $timeout: angular.ITimeoutService,
private Users: core.Users,
private Auth: core.Auth,
private Courses: core.Courses
) {
this.refresh();
}

}

SemesterCtrl.$inject=['$mdDialog','Semesters','$timeout',
'Users','Auth','Courses'];
}
