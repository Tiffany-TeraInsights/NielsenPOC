/// <reference path="../../../../typings/index.d.ts" />

module core {
'use strict';

/** Class to manage the authentication and roles */
export class Auth {
// expose so info can be displayed from outside
public user: IUser; // the current user
public loggedIn: boolean=false;

/**
* Attempt a login
*/
loginAdmin(username: string,password: string) {
var self=this;

return self.$http.post('/loginAdmin',{
username: username,
password: password
}).then((data: Object) => {
self.user=<IUser>data['data'];
if(self.user.roles=="admin") {
self.loggedIn=true;
}
else {
self.loggedIn=false;
}
return;
});
}

loginStudent(username: string,password: string) {
var self=this;

return self.$http.post('/loginStudent',{
username: username,
password: password
}).then((data: Object) => {
self.user=<IUser>data['data'];
if(self.user.roles=="student") {
self.loggedIn=true;
}
else {
self.loggedIn=false;
}
self.loggedIn=true;
return;
})
}

loginFaculty(username: string,password: string) {
var self=this;

return self.$http.post('/loginFaculty',{
username: username,
password: password
}).then((data: Object) => {
self.user=<IUser>data['data'];
if(self.user.roles=="faculty"||"professor"||"advisor") {
self.loggedIn=true;
}
else {
self.loggedIn=false;
}
self.loggedIn=true;
return;
})
}

getLoggedInUser() {
return this.user;
}
/**
* Get the public key of the user
*/

logout() {
var self=this;
return self.$http.get('/logout')
.then(() => {
self.loggedIn=false;
});
}

noSession(err: any) {
alert("Could not save the data since your session expired. You need to log in again");
location.reload();
}

register(firstName: string,lastName: string,email: string,password: string,roles: string,cid: string) {
var that=this;
console.log("State: ",that);
return this.$http.post('/register',
{
firstName: firstName,
lastName: lastName,
email: email,
password: password,
roles: roles,
cid: cid

}).then(
(rep: any) => {
return "User "+this.user+" registered";
}
)
}


isAdmin(): boolean {
// Is this too fragile? Use Lodash to search?
return this.user&&this.user.roles=='admin';
}

isFaculty(): boolean {
return this.user&&this.user.roles=='faculty';
}

constructor(private $http: ng.IHttpService) {

}

}
}
