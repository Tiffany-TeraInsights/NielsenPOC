module core {

export interface ICourse extends ng.resource.IResource<ICourse> {
cid: string; // course id
eid: string;
name: string;
enrollment: number;
professor1: string;
professor2: string;
}

interface ICourseResource extends ng.resource.IResourceClass<ICourse> {
getAll(params: Object,success?: Function,error?: Function): ICourse[];
}

export class Courses {
static Resource($resource: ng.resource.IResourceService): ICourseResource {
var url="/courses/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'getAll': { method: 'GET',params: {},url: url+"all/:eid",isArray: true },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <ICourseResource>resource;
}

private list: ICourse[]=[];
private listByEid: { [eid: string]: ICourse }={};
private listForSemester: ICourse[]=[];
private course: ICourse;
private resource: ICourseResource;

getListForSemester(): ICourse[] {
return this.listForSemester;
}

addCourse(courseI: ICourse) {
var that=this;
var defer=this.$q.defer();
this.resource.save(courseI,(course: ICourse) => {
that.list.push(course);
that.listByEid[course.eid]=course; // update index
defer.resolve(course);
},(err) => { defer.reject(err) });
return defer.promise;
}

findAllCoursesForSemester() {
var defer=this.$q.defer();
this.resource.query((courses) => {
this.list=courses;
_.forEach(this.list,function(value) {
if(value.eid==this.current.eid) {
this.listForSemester.push(value);
}
});
defer.resolve(courses);
},(err) => { defer.reject(err) });
return defer.promise;
}


refresh() {
var defer=this.$q.defer();
this.resource.query((courses) => {
this.list=courses;
defer.resolve(courses);
},(err) => { defer.reject(err) });
return defer.promise;
}

removeCourse(course: ICourse) {
return course.$remove();
}

getAllCourses(eid: string) {
return this.resource.get({ eid: eid }).$promise;
}


static $inject=['$resource','$q','$http'];

constructor($resource: ng.resource.IResourceService,
private $q: ng.IQService,
private $http: ng.IHttpService) {
this.resource=core.Courses.Resource($resource);

}
}

}
