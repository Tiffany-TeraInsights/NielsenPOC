/// <reference path="../../../../typings/globals/angular/index.d.ts" />
/// <reference path="../../../../typings/globals/angular-resource/index.d.ts" />

module core {
'use strict';

export class UserInfo {
firstName: string;
lastName: string;
email: string;


serialize(): string {
return JSON.stringify({
firstName: this.firstName,
lastName: this.lastName,
email: this.email
});
}

deserialize(data: string) {
var obj=JSON.parse(data);
this.firstName=obj.firstName||'';
this.lastName=obj.lastName||'';
this.email=obj.email; // TODO: throw if not defined
}

constructor() { }

}
export interface IUser extends ng.resource.IResource<IUser> {
id?: string;
firstName: string;
lastName: string;
email: string;
password: string;
roles: string;
cid: string;
}

interface IUserResource extends ng.resource.IResourceClass<IUser> {
update(params: Object,data: IUser,success?: Function,error?: Function): IUser;
}

export class Users {
static Resource($resource: ng.resource.IResourceService): IUserResource {
var url="/users/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'get': { method: 'GET',params: { id: "@id" },url: url+":id" },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <IUserResource>resource;
}

private resource: IUserResource;
private list: IUser[]=[];
private listByEmail: { [email: string]: IUser };



getFaculty(): IUser[] {
return this.list.filter((user) => {
return user.roles=='faculty';
});
}

newUser(): IUser {
return new this.resource();
}

add(userI: any) {
var that=this;
var defer=this.$q.defer();
this.resource.save(userI,(user: IUser) => {
that.list.push(user);
defer.resolve(user);
},(err) => { defer.reject(err) });
return defer.promise;
}

update(user: IUser) {
return this.resource.update({
id: user.id
},user).$promise;
}

refresh() {
var that=this;
return this.resource.query((users) => {
that.list=users;
//that.listByEmail=_.indexBy(that.list,(user: IUser) => { return user.email; });
return users;
}).$promise;
}

constructor($resource: ng.resource.IResourceService,
private $q: angular.IQService) {
this.resource=core.Users.Resource($resource);
}

}

}
