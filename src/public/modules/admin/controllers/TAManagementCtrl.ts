module admin {
'use strict'

export class TAManagementCtrl {

private currentSemesterID;
private currentS;
private courses: core.ICourse[]=[];
private courseSections: core.ICourseSection[]=[];
private selectedCourse: core.ICourse;
private selectedCourseSections: core.ICourseSection[]=[];
private recommendations: core.IRecommendation[]=[];
private recByCourse: core.IRecommendation[]=[];
private studentProfiles: core.IStudentProfile[]=[];
private appProfiles: core.IStudentProfile[]=[];
private profilesForApps;
private users;
private previousCourses;
private previousCourseSections: core.ICourseSection[]=[];
private thisCourse;
private TAList=[];

select(course: core.ICourse) {
var self=this;
this.selectedCourse=course;
this.getCourseSections(this.selectedCourse);
this.getApps(this.selectedCourse);
this.selectedCourseSections.forEach(function(cs) {
self.getTAInfo(cs);
})
//this.getProfiles();
}

getCourseSections(course: core.ICourse) {
var list=[];
this.courseSections.forEach(function(cs) {
if(course.eid==cs.eid&&course.cid==cs.cid&&course.name==cs.cName) {
list.push(cs);
}
});
this.selectedCourseSections=list;
}


assignTA(cid: string,sid: string,app: core.IRecommendation) {
var list=[];
var self=this;
var sec=this.CourseSections.getAll();
sec.forEach(function(cs) {
if(cid==cs.cid&&sid==cs.sid&&self.currentSemesterID==cs.eid) {
list.push(cs);
};
});
this.appendTAList(list[0],app);
}

unassignTA(app: core.IRecommendation) {
var self=this;
var sec=this.CourseSections.getAll();
var cour [];
var currentTAs="";
sec.forEach(function(cs) {
if(cs.cid==app.cid&&cs.sid==app.sid&&self.currentSemesterID==cs.eid) {
cour.push(cs);
};
});
var r=cour[0].TAs.split(";");
r.forEach(function(x) {
var l=x.split(":");
if(l[0]!=app.student&&l!="") {
currentTAs=currentTAs+l[0]+":"+l[1]+";";
};
});
cour[0].TAs=currentTAs;
this.CourseSections.updateCourseSection(cour[0]);
}

appendTAList(courseSection: core.ICourseSection,app: core.IRecommendation) {
var tas;
if(courseSection.TAs=="") {
courseSection.TAs=app.student+":"+app.taType+";";
}
else if(courseSection.TAs!="") {
courseSection.TAs=courseSection.TAs+app.student+":"+app.taType+";";
}
this.CourseSections.updateCourseSection(courseSection);
}

assign(app: core.IRecommendation) {
if(app.approved=="") {
app.approved=this.Auth.getLoggedInUser().email;
this.Recommendations.update(app);
this.assignTA(app.cid,app.sid,app);
}
else if(app.approved!="") {
app.approved="";
this.Recommendations.update(app);
this.unassignTA(app);
}

}



findCourseHistory(course: core.ICourse) {
var self=this;
var list=[];
var prevSem=[];
list=this.Courses.getAll();
list.forEach(function(cour) {
if(cour.cid==course.cid&&cour.name==course.name&&cour.eid!=self.selectedCourse.eid) {
prevSem.push(cour);
}
});
this.previousCourses=prevSem;

return prevSem;
}

getPrevCourseSections(course: core.ICourse) {
var list=[];
var self=this;
this.courseSections=this.CourseSections.getAll();
this.courseSections.forEach(function(cs) {
if(course.eid==cs.eid&&course.cid==cs.cid&&course.name==cs.cName) {
list.push(cs);
}
});
list.forEach(function(courseS) {
self.getTAInfo(courseS);
});
return list;
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


getApps(course: core.ICourse) {
var list=[];
this.recommendations.forEach(function(rec) {
if(rec.cid==course.cid&&rec.eid==course.eid) {
list.push(rec);
}
});
this.recByCourse=list;
}

getUserName(app: core.IRecommendation): string {
var list;
this.users.forEach(function(user) {
if(user.email==app.student) {
list=user;
}
})
return list.firstName+" "+list.lastName;
}

getUserType(app: core.IRecommendation): string {
var list;
var u;
this.users.forEach(function(user) {
if(user.email==app.student) {
u=user;
}
})
list=this.StudentProfile.getUserProfile(u);
return list.studentType;
}

getUserGPA(app: core.IRecommendation) {
var list;
var u: core.IUser;
this.users.forEach(function(user) {
if(user.email==app.student) {
u=user;
}
})
list=this.StudentProfile.getUserProfile(u);
return list.GPA;
}

getUserDegrees(app: core.IRecommendation) {
var list: core.IStudentProfile;;
var degree=[];
var l=[];
var u: core.IUser;
this.users.forEach(function(user) {
if(user.email==app.student) {
u=user;
}
})
list=this.StudentProfile.getUserProfile(u);
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
var list=this.studentProfiles;
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

getProfiles() {
var list=[];
var user;
var profiles=this.StudentProfile.getAll();
var users=this.Users;
this.recByCourse.forEach(function(app) {
user=users.getUser(app.student);
list.push(profiles.getUserProfile(user[0])[0]);
});
this.profilesForApps=list;
}

openStudentProfile(app: core.IRecommendation) {
var application=_.cloneDeep(app);
this.$mdDialog.show({
controller: StudentDetailCtrl,
controllerAs: 'cMod',
templateUrl: 'modules/admin/views/studentProfileView.html',
locals: { app: application }
});
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
})

this.TAList[courseS.sid]=list2;
//return list2;
//return list2;
}



refresh() {
var self=this;
this.Semesters.refresh().then((semesters: Array<core.ISemester>) => {
self.currentSemesterID=self.Semesters.current()[0].eid;
self.currentS=self.Semesters.current()[0];
})
this.Courses.refresh().then((courses: Array<core.ICourse>) => {
self.courses=this.Courses.getCoursesForSemester(this.currentSemesterID);
})
this.CourseSections.refresh().then((courseSections: Array<core.ICourseSection>) => {
self.courseSections=this.CourseSections.getSectionsForSemester(this.currentSemesterID);
});
this.Recommendations.refresh().then((recommendations: Array<core.IRecommendation>) => {
this.recommendations=this.Recommendations.getAll();
});
this.StudentProfile.refresh().then(() => {
this.studentProfiles=this.StudentProfile.getAll();
});
this.Users.refresh().then(() => {
this.users=this.Users.getStudents();
})
}


static $inject=['$mdDialog','Semesters','$timeout',
'Users','Auth','Courses','CourseSections','Recommendations','StudentProfile'];

constructor(private $mdDialog: ng.material.IDialogService,
private Semesters: core.Semesters,
private $timeout: angular.ITimeoutService,
private Users: core.Users,
private Auth: core.Auth,
private Courses: core.Courses,
private CourseSections: core.CourseSections,
private Recommendations: core.Recommendations,
private StudentProfile: core.StudentProfile) {
this.refresh();
}
}

}
