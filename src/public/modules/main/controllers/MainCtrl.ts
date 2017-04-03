
module main {
'use strict';

export class MainCtrl {
private state: string;
private user: core.UserInfo;
private password: string;
private password2: string;
public roles=['admin','faculty','student','hr'];

go(path: string) {
window.location.assign(path);
}

register() {
this.state='register';
}

signup(firstName: string,lastName: string,email: string,password: string,password2: string,roles: string) {
if(password==password2&&password!=null&&email!=null) {
this.Auth.register(firstName,lastName,email,password,roles,"")
.then(() => {
this.Notify.info('Registration Successful');
this.state="registration-complete"
},() => {
this.Notify.error('Registration Failed');
});
(err) => {
console.log("Sign up failed: ",err);
this.Notify.error("Registration Failed. "+err.data);
};
}
else {
this.Notify.error("Passwords don't match or were left blank");
}
}


accept() {

this.state='info';
var registerB=new Blob([this.user.serialize()],
{ type: "text/plain;charset=utf-8" });

}
static $inject=['$http','Auth','Notify'];

constructor(
private $http: ng.IHttpService,
private Auth: core.Auth,
private Notify: core.Notify,

) {
this.user=new core.UserInfo();
}

}


}
