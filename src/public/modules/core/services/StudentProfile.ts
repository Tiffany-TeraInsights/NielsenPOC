/// <reference path="../../../../typings/globals/angular/index.d.ts" />
/// <reference path="../../../../typings/globals/angular-resource/index.d.ts" />

module core {
'use strict';


export interface IStudentProfile extends ng.resource.IResource<IStudentProfile> {
email: string;
studentType: string;
FSS: boolean;
GPA: string;
testScores: string;
courseList: string;
courseListGrades: string;
degrees: string;
pastTAships: string;
}

interface IStudentProfileResource extends ng.resource.IResourceClass<IStudentProfile> {
update(params: Object,data: IStudentProfile,success?: Function,error?: Function): IStudentProfile;
}

export class StudentProfile {
static Resource($resource: ng.resource.IResourceService): IStudentProfileResource {
var url="/studentprofiles/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'get': { method: 'GET',params: { id: "@id" },url: url+":id" },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <IStudentProfileResource>resource;
}

private resource: IStudentProfileResource;
private list: IStudentProfile[]=[];
private listByEmail: { [email: string]: IStudentProfile };


add(studentP: any) {
var that=this;
var defer=this.$q.defer();
this.resource.save(studentP,(sp: IStudentProfile) => {
that.list.push(sp);
that.listByEmail[sp.email]=sp; // update index
defer.resolve(sp);
},(err) => { defer.reject(err) });
return defer.promise;
}

update(userP: IStudentProfile) {
return this.resource.update({
email: userP.email
},userP).$promise;
}

refresh() {
var that=this;
return this.resource.query((studentPs) => {
that.list=studentPs;
//that.listByEmail=_.indexBy(that.list,(user: IUser) => { return user.email; });
return studentPs;
}).$promise;
}

static $inject=['$resource','$q','$http'];

constructor($resource: ng.resource.IResourceService,
private $q: angular.IQService,
private $http: ng.IHttpService,) {
this.resource=core.StudentProfile.Resource($resource);
}

}

}
