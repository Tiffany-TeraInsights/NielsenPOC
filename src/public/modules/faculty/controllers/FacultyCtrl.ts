

module faculty {
'use strict'

export class FacultyCtrl {

private user: core.IUser;
private state: string="courses";
private stateName: string;
private courses: core.ICourse[];
private courseSections;

updateState() {
switch(this.state) {
case 'courses':
this.stateName="Courses";
break;
}
}

selectView(view: string) {
this.state=view;
this.updateState();
}

refresh() {

}



static $inject=['$mdSidenav','$mdDialog','$http','Users','Auth','Notify','Courses','CourseSections'];

constructor(
private $mdSidenav: ng.material.ISidenavService,
private $mdDialog: ng.material.IDialogService,
private $http: ng.IHttpService,
private Users: core.Users,
private Auth: core.Auth,
private Notify: core.Notify,
private Courses: core.Courses,
private CourseSections: core.CourseSections
) {
this.updateState();
this.refresh();
}

}


}
