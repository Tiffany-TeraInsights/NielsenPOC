module student {
'use strict'

export class AppAdditionCtrl {

private student: core.IUser;
private studentProfile: core.IStudentProfile;
private courseList: core.ICourse[]=[];
private courseSectionsList: core.ICourseSection[]=[];
private applyingSemester: core.ISemester;
private TAType: string;
private sectionsForCourse;
private selectedCourse;
private sectionDetails=[];

public TATypes=[
{ type: "Teaching TA",description: "sole responsibility for teaching one or more course sections" },
{ type: "Support TA",description: "include any or all of the following: grading, leading recitations, providing administrative support, and clerical tasks" },
{ type: "Hourly Grader",description: "Hourly graders are not TAs. Hourly graders are selected by the instructor according to the FTE provided by the TA Committee." }
];

accept() {
this.assignApplicationID();
this.$mdDialog.hide();
}

cancel() {
this.$mdDialog.cancel();
}

assignApplicationID() {
var list;
var self=this;
this.courseList.filter((c) => {
if(c.id==self.selectedCourse) {
list=c;
}
})
this.selectedCourse=list;
this.taApp.eid=this.applyingSemester.eid;
this.taApp.cid=this.selectedCourse.cid;
var correctCID;
var s="";
correctCID=this.selectedCourse.cid.split(" ");
correctCID.forEach(function(cidPart) {
s=s+cidPart;
});
this.taApp.id=this.taApp.eid+":"+s+":"+this.taApp.sid+":"+this.student.lastName;
};

getCoursesForSemester() {
return this.courseList;
}

getSectionsForCourse(courseCid) {
var list;
var self=this;
this.courseList.filter((c) => {
if(c.id==courseCid) {
list=c;
}
})
var hello=list;
var sl=[];
var self=this;
this.courseSectionsList.forEach(function(val2) {
if((val2.eid==self.taApp.eid)&&(val2.cid==hello.cid)&&(val2.cName==hello.name)) {
sl.push(val2);
}
});
this.sectionsForCourse=sl;
this.sectionsForCourse.forEach(function(cs) {
self.getDetailsOfSections(cs);
});
return this.sectionsForCourse;
}

getDetailsOfSections(courseS: core.ICourseSection) {
var sl=[];
var full=[];
var result=courseS.BRPD.split(";");
result.forEach(function(v) {
sl=[];
var r=v.split(":");
r.forEach(function(part) {
sl.push(part);
});
full.push(sl);
});
this.sectionDetails[courseS.id]=full;
}

refresh() {
var self=this;
this.student=this.Auth.getLoggedInUser();
this.Semesters.refresh().then(() => {
self.applyingSemester=self.Semesters.current()[0];
self.taApp.eid=self.applyingSemester.eid;
});
this.Courses.refresh().then(() => {
self.courseList=self.Courses.getCoursesForSemester(self.Semesters.current()[0].eid);
});
this.CourseSections.refresh().then(() => {
self.courseSectionsList=self.CourseSections.getSectionsForSemester(self.Semesters.current()[0].eid);
});

}


static $inject=['taApp','StudentProfile','$mdSidenav','$mdDialog','$http','Semesters','Auth','Notify','Courses','CourseSections'];

constructor(private taApp: core.IRecommendation,
private StudentProfile: core.StudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Semesters: core.Semesters,
private Auth: core.Auth,
private Notify: core.Notify,
private Courses: core.Courses,
private CourseSections: core.CourseSections
) {
this.refresh();
}
}
}
