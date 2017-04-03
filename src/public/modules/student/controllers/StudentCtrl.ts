/// <reference path="../../../../typings/index.d.ts"/>

module student {
'use strict'


export class StudentCtrl {
private state: string="summary";
private stateName: string;

private user: string;
private profile: core.IStudentProfile;


updateState() {
switch(this.state) {
case 'studentProfile':
this.stateName="Profile";
break;

case 'summary':
this.state="Summary";
break;
}
}

getUser() {
if(this.Auth.user!=null) {
this.user=this.Auth.user.firstName+" "+this.Auth.user.lastName;
} else {
this.user="";
}
}

selectView(view: string) {
this.state=view;
this.updateState();
this.$mdSidenav('left').isLockedOpen();
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
}
});
}


static $inject=['StudentProfile','$mdSidenav','$mdDialog','$http','Auth','Notify'];

constructor(private StudentProfile: core.StudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify
) {
this.updateState();
//this.getUser();
//this.user=new core.UserInfo();
}

}


}
