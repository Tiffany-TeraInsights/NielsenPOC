module student {
'use strict'

export class ProfileCtrl {

private user: core.IUser;
private profile: core.IStudentProfile;
private tl=[];
private dl=[];
private cl=[];

refresh() {
this.user=this.Auth.getLoggedInUser();
this.StudentProfile.refresh().then(() => {
this.profile=this.StudentProfile.getUserProfile(this.user)[0];
this.getTestList();
this.getDegreeList();
this.getCourseList();
});
}

getTestList() {
this.tl=[];
var result=this.profile.testScores.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
this.tl=separate;
}

getDegreeList() {
this.dl=[];
var result=this.profile.degrees.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
this.dl=separate;
}

getCourseList() {
this.cl=[];
var result=this.profile.courseList.split(";")
var separate=[];
result.forEach(function(value) {
var r=value.split(":");
if(r[0]=="") { }
else { separate.push(r); }
});
separate.push(this.getCourseName[separate[0]]);
this.cl=separate;
}

getCourseName(cid: string) {
var hey: core.ICourse[]=[];
var list=this.Courses.getAll();
list.filter((course) => {
if(course.cid==cid) {
hey.push(course);
}
});
return hey[0].name;
}

openAddEditDialog(studentProfile: core.IStudentProfile) {
// create (if not given) or deep copy the semester
var newStudentProfile=studentProfile? _.cloneDeep(studentProfile):
<core.IStudentProfile>{ email: "",studentType: "",FSS: false,GPA: "",testScores: "",courseList: "",courseListGrades: "",degrees: "",pastTAships: "" };
var that=this;

that.$mdDialog.show({
controller: StudentProfileCtrl,
controllerAs: 'cMod',
templateUrl: 'modules/student/views/addEditStudentProfile.html',
clickOutsideToClose: true,
locals: { studentProfile: newStudentProfile }
}).then(() => {
// is this a new semester?
if(studentProfile) { // copy edited semester back into semester
that.StudentProfile.update(newStudentProfile);
studentProfile.email=newStudentProfile.email;
studentProfile.studentType=newStudentProfile.studentType;
studentProfile.FSS=newStudentProfile.FSS;
studentProfile.GPA=newStudentProfile.GPA;
studentProfile.testScores=newStudentProfile.testScores;
studentProfile.courseList=newStudentProfile.courseList;
studentProfile.courseListGrades=newStudentProfile.courseListGrades;
studentProfile.degrees=newStudentProfile.degrees;
studentProfile.pastTAships=newStudentProfile.pastTAships;

} else { // add this semester to the list
console.log("State"+this);
newStudentProfile.email=this.Auth.user.email;
that.StudentProfile.add(newStudentProfile)
.then(() => {
this.profile=newStudentProfile;
});
this.refresh();
}
});
}

static $inject=['StudentProfile','$mdSidenav','$mdDialog','$http','Auth','Notify','Courses'];

constructor(private StudentProfile: core.StudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify,
private Courses: core.Courses
) {
this.refresh();
}
}

}
