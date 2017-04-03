
/// <reference path="../../../../typings/index.d.ts"/>

module admin {
'use strict';

export class StudentsCtrl {
private students: core.IUser[]=[];


constructor(private $mdDialog: ng.material.IDialogService,
private $timeout: angular.ITimeoutService,
private Users: core.Users,
private Auth: core.Auth
) {
//this.refresh();
}
}

}
