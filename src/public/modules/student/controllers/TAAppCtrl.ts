module student {
'use strict'


export class TAAppCtrl {

private user: core.IUser;
private userProfile: core.IStudentProfile;
private applications: core.IRecommendation[]=[];
private userApps: core.IRecommendation[]=[];
private currentSemester;

refresh() {
this.user=this.Auth.getLoggedInUser();
this.Recommendations.refresh().then(() => {
this.applications=this.Recommendations.getAll();
});
this.Semesters.refresh().then(() => {
this.currentSemester=this.Semesters.current()[0].eid;
this.loadUserApps();
})
this.StudentProfile.refresh().then(() => {
this.userProfile=this.StudentProfile.getUserProfile(this.user)[0];
});
}

delete(rec: core.IRecommendation) {
this.Recommendations.remove(rec);
this.refresh();
}

loadUserApps() {
var list=[];
var self=this;
this.applications.forEach(function(app) {
var result=app.id.split(":");
if(result[0]==self.currentSemester&&result[3]==self.user.lastName) {
list.push(app);
}
});
this.userApps=list;
}

findPendingApps() {
return this.userApps.filter((apps) => {
return (apps.approved=="");
});
}

findApprovedApps() {
return this.userApps.filter((apps) => {
return (apps.approved!="");
})
}

AddEditDialog(taApp: core.IRecommendation) {
var newApp=taApp? _.cloneDeep(taApp):
<core.IRecommendation>{ id: "",faculty: "",student: "",cid: "",sid: "",eid: "",approved: "",description: "" };

this.$mdDialog.show({
controller: AppAdditionCtrl,
controllerAs: 'cMod',
templateUrl: 'modules/student/views/addEditApplication.html',
clickOutsideToClose: true,
locals: { taApp: newApp }
}).then(() => {
if(taApp) {
this.Recommendations.update(newApp);
taApp.id=newApp.id;
taApp.eid=newApp.eid;
taApp.cid=newApp.cid;
taApp.taType=newApp.taType;
taApp.sid=newApp.sid;
taApp.student=newApp.student;
taApp.faculty=newApp.faculty;
taApp.approved=newApp.approved;
taApp.description=newApp.description;
}
else {
newApp.student=this.Auth.user.email;
this.Recommendations.add(newApp)
.then(() => {
this.applications.push(newApp);
})
this.refresh();
}
});
}

static $inject=['Recommendations','StudentProfile','$mdSidenav','$mdDialog','$http','Auth','Notify','Semesters'];

constructor(private Recommendations: core.Recommendations,
private StudentProfile: core.StudentProfile,
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify,
private Semesters: core.Semesters
) {
this.refresh();
}

}

}
