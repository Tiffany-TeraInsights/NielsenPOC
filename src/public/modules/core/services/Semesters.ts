
module core {
'use strict';

export interface CourseSection {
sid: string;
enrollment: number;
}

export interface Course {
cid: string;
enrollment: number;
sections: CourseSection[];
TAs: IUser[];
professor: IUser[];
}


export interface ISemester extends ng.resource.IResource<ISemester> {
eid: string;
name: string;
admin: string;
current: boolean;
}

interface ISemesterResource extends ng.resource.IResourceClass<ISemester> {
update(params: Object,data: ISemester,success?: Function,error?: Function): ISemester;
}

export class Semesters {

static Resource($resource: ng.resource.IResourceService): ISemesterResource {
var url='/semesters/';
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'get': { method: 'GET',params: { eid: "@eid" },url: url+":eid" },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <ISemesterResource>resource;
}

private list: ISemester[]=[];
private listById: { [eid: string]: ISemester }={};
private semester: ISemester;
private resource: ISemesterResource;


getAll(): ISemester[] {
return this.list;
}

current(): ISemester {
return this.semester;
}

remove(eid: string) {
return this.resource.remove({ id: eid }).$promise;
}

setCurrent(semID: string) {
this.semester=this.listById[semID];

}

refresh() {
var defer=this.$q.defer();
this.resource.query((semesters) => {
this.list=semesters;
this.listById=_.indexBy(semesters,(semester: ISemester) => { return semester.eid; });
if(this.semester)
this.setCurrent(this.semester.eid); // keep the same current
else { // select last as current
var sortIDs=this.list.map((sem) => { return sem.eid; }).sort();
var ID=sortIDs[sortIDs.length-1];
this.setCurrent(ID);
}
defer.resolve(semesters);
},(err) => { defer.reject(err) });
return defer.promise;
}

/*add(sem: ISemester) {
let semester=new this.resource(sem);
console.log(semester);
return this.resource.save(semester,(semes: ISemester) => {
this.list.push(semes);
console.log(semes);
console.log(this.list);
return semes;
}).$promise;
}*/

add(sem: ISemester) {

var that=this;
var defer=this.$q.defer();
this.resource.save(sem,(semester: ISemester) => {
that.list.push(semester);
that.listById[semester.eid]=semester; // update index
defer.resolve(semester);
},(err) => { defer.reject(err) });
return defer.promise;

/*var that=this;
let seme=new this.resource(sem);
this.resource.save(seme,(semester: ISemester) => {
console.log("add semester method return = "+semester);
that.list.push(semester);
//that.listById[semester.eid] = semester; // update index
}).$promise; */
}

update(sem: ISemester) {
let defer=this.$q.defer();
this.resource.update({ id: sem.eid },sem,
(semester: ISemester) => { defer.resolve(semester); },
(err) => { defer.reject(err); });
return defer.promise;
}


static $inject=['$resource','$q','$http'];

constructor($resource: ng.resource.IResourceService,
private $q: ng.IQService,
private $http: ng.IHttpService,) {
this.resource=core.Semesters.Resource($resource);
}

}
}
