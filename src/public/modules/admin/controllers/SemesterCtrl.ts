
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
private courseSections: core.ICourseSection[]=[];
private cs: core.ICourseSection[]=[];
private currentCourse: core.ICourse;
private csByCourse;
/*setCurrent(semester: core.ISemester) {
this.Semesters.setCurrent(semester.eid);
this.activeEid=semester.eid;
} */

private exportCSV=() => {
let fileName="Courses.csv";
let out="Course ID,Course Name,Enrollment,Role\n";
out+=this.users.map((user) => {
return `${user.firstName} ${user.lastName},${user.email},${user.state},${user.role}`;
}).join('\n');
saveAs(new Blob([out],{ type: "text/csv" }),fileName);
}

setCurrent(semester: core.ISemester) {
this.activeEid=semester.eid;
var updateSem1=<core.ISemester>{};
var updateSem2=<core.ISemester>{};
this.semesters.forEach(function(sem) {
if(sem.current==true&&(sem.eid!=semester.eid)) {
sem.current=false;
updateSem1=sem;
}
else if(sem.current==false&&(sem.eid==semester.eid)) {
sem.current=true;
updateSem2=sem;
}
else { }
});
if(updateSem1.eid!=(undefined||null)) {
this.Semesters.update(updateSem1).then(() => {
console.log(updateSem1+" is no longer the active semester");
});
}
if(updateSem2.eid!=(undefined||null)) {
this.Semesters.update(updateSem2).then(() => {
console.log(updateSem2+" is the new active semester");
})
}
console.log("Current Semester set to ",semester.eid);
}

select(semester: core.ISemester) {
this.current=semester;
this.coursesBySemester(this.current);
this.matchCourseSections(this.courses);
}

selectCourse(course: core.ICourse) {
this.currentCourse=course;
this.coursesBySemester(this.current);
this.courseSectionsByCourse(this.currentCourse);
}

courseSectionsByCourse(course: core.ICourse) {
var list=[];
this.courseSections.forEach(function(cs) {
if(cs.cid==course.cid&&cs.eid==course.eid&&cs.cName==course.name) {
list.push(cs);
}
});
this.csByCourse=list;;
}

getTAInfo(taInfo: string) {
var t=taInfo.split(":");
var list=[];
var users=this.Users.getStudents();
users.filter((user) => {
if(user.email==t[0]) {
list.push(user.firstName+" "+user.lastName);
}
})
list.push(t[1]);

return list;
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

sectionsByCourse(course: core.ICourse) {
var list=[];
this.courseSections.forEach(function(val) {
if(val.cid==course.cid&&val.cName==course.name) {
list.push(val);
}
});
return list;
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

getCSTime(cs: core.ICourseSection) {
var list=[];
var r=cs.BRPD.split(";");
r.forEach(function(x) {
var t=x.split(":");
list.push(t);
});
return list;
}

matchCourseSections(courses: core.ICourse[]) {
var cs=this.courseSections;
var newc=[];
courses.forEach(function(value1) {
value1.sections="";
cs.forEach(function(value2) {
if(value1.cid==value2.cid&&value1.name==value2.cName) {
if(value1.sections=="") {
value1.sections=value2.sid;
}
else { value1.sections=value1.sections+";"+value2.sid; }
}
});
newc.push(value1);
});
this.courses=newc;
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
self.activeEid=self.Semesters.current()[0].eid;
})
this.Courses.refresh().then((courses: Array<core.ICourse>) => {
self.courses=courses;
})
this.CourseSections.refresh().then((courseSections: Array<core.ICourseSection>) => {
self.courseSections=courseSections;
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
private Courses: core.Courses,
private CourseSections: core.CourseSections
) {
this.refresh();
}

}

SemesterCtrl.$inject=['$mdDialog','Semesters','$timeout',
'Users','Auth','Courses','CourseSections'];
}
