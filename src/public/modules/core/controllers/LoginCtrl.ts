
/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../../../typings/index.d.ts" />

module core {
'use strict';


/**
* This controllers manages the login process
* 
* @export
* @class LoginCtrl
*/
export class LoginCtrl {
private state: string="notLoggedIn";
private email: string;
private password: string;

// Skip past signup phases
loginAdmin(username: string,password: string) {
this.Auth.loginAdmin(username,password)
.then((rep) => {
console.log("Logged in");
this.state="admin-main"
this.Notify.info('Login Successful');
console.log(this.Auth);
},(error) => {
console.log("Logged failed: ",error);
this.state="undefined"
this.Notify.error('Login Failed. '+error.statusText);
});
}

loginStudent(username: string,password: string) {
this.Auth.loginStudent(username,password)
.then((rep) => {
console.log("Logged in");
this.state="student-main"
this.Notify.info('Login Successful');
console.log(this.Auth);
},(error) => {
console.log("Logged failed: ",error);
this.state="undefined"
this.Notify.error('Login Failed. '+error.statusText);
});
}

loginFaculty(username: string,password: string) {
this.Auth.loginFaculty(username,password)
.then((rep) => {
console.log("Logged in");
this.state="faculty-main"
this.Notify.info('Login Successful');
console.log(this.Auth);
},(error) => {
console.log("Logged failed: ",error);
this.state="undefined"
this.Notify.error('Login Failed. '+error.statusText);
});
}

static $inject=['$sce','Notify','Auth'];

constructor(
private $sce: ng.ISCEService,
private Notify: Notify,
private Auth: Auth,
) {
}
}
}
