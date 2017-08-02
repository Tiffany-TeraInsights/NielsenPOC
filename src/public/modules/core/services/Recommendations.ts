
module core {

export interface IRecommendation extends ng.resource.IResource<IRecommendation> {
id: string;
faculty: string;
student: string;
cid: string;
taType: string;
sid: string;
eid: string;
approved: string;
description: string;
}

interface IRecommendationResource extends ng.resource.IResourceClass<IRecommendation> {
getAll(params: Object,success?: Function,error?: Function): IRecommendation[];
update(params: Object,data: IRecommendation,success?: Function,error?: Function): IRecommendation;

}

export class Recommendations {
static Resource($resource: ng.resource.IResourceService): IRecommendationResource {
var url="/recommendations/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'getAll': { method: 'GET',params: {},url: url+"all/:id",isArray: true },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <IRecommendationResource>resource;
}

private list: IRecommendation[]=[];
private listByEid: { [eid: string]: IRecommendation }={};
private listForCourses: IRecommendation[]=[];
private listForFaculty: IRecommendation[]=[];
private course: IRecommendation;
private resource: IRecommendationResource;

getListForSemester(): IRecommendation[] {
return this.listForCourses;
}

getAll() {
return this.list;
}

add(rec: IRecommendation) {
var that=this;
var defer=this.$q.defer();
this.resource.save(rec,(r: IRecommendation) => {
that.list.push(r);
defer.resolve(r);
},(err) => { defer.reject(err) });
return defer.promise;
}

update(rec: IRecommendation) {
let defer=this.$q.defer();
this.resource.update({ id: rec.id },rec,
(course: IRecommendation) => { defer.resolve(course); },
(err) => { defer.reject(err); });
return defer.promise;
}

refresh() {
var defer=this.$q.defer();
this.resource.query((recomm) => {
this.list=recomm;
defer.resolve(recomm);
},(err) => { defer.reject(err) });
return defer.promise;
}

remove(rec: IRecommendation) {
return rec.$remove();
}

getAllForStudent(userEmail: string) {
return this.list.filter((user) => {
return user.student==userEmail;
});
}

static $inject=['$resource','$q','$http'];

constructor($resource: ng.resource.IResourceService,
private $q: ng.IQService,
private $http: ng.IHttpService) {
this.resource=core.Recommendations.Resource($resource);

}
}

}
