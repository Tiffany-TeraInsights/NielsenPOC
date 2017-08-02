module core {

export interface ICourseSection extends ng.resource.IResource<ICourseSection> {
id: string;
sid: string
cid: string; // course id
cName: string;
eid: string;
BRPD: string;
enrollment: number;
TAs: string;
}

interface ICourseSectionResource extends ng.resource.IResourceClass<ICourseSection> {
getAll(params: Object,success?: Function,error?: Function): ICourseSection[];
update(params: Object,data: ICourseSection,success?: Function,error?: Function): ICourseSection;

}

export class CourseSections {
static Resource($resource: ng.resource.IResourceService): ICourseSectionResource {
var url="/courseSections/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'getAll': { method: 'GET',params: {},url: url+"all/:eid",isArray: true },
'save': { method: 'POST',url: url },
'update': { method: 'PUT',params: { id: "@id" },url: url+":id" },
'remove': { method: 'DELETE',params: { id: "@id" },url: url+":id" }
});
return <ICourseSectionResource>resource;
}

private list: ICourseSection[]=[];
private listByEid: { [eid: string]: ICourseSection }={};
private listForCourses: ICourseSection[]=[];
private listForFaculty: ICourseSection[]=[];
private course: ICourseSection;
private resource: ICourseSectionResource;

getListForSemester(): ICourseSection[] {
return this.listForCourses;
}

getAll() {
return this.list;
}

addCourseSection(courseI: ICourseSection) {
var that=this;
var defer=this.$q.defer();
this.resource.save(courseI,(course: ICourseSection) => {
that.list.push(course);
that.listByEid[course.eid]=course; // update index
defer.resolve(course);
},(err) => { defer.reject(err) });
return defer.promise;
}

updateCourseSection(courseS: ICourseSection) {
let defer=this.$q.defer();
this.resource.update({ id: courseS.id },courseS,
(course: ICourseSection) => { defer.resolve(course); },
(err) => { defer.reject(err); });
return defer.promise;
}

findAllCoursesForSemester() {
var defer=this.$q.defer();
this.resource.query((courses) => {
this.list=courses;
_.forEach(this.list,function(value) {
if(value.eid==this.current.eid) {
this.listForCourses.push(value);
}
});
defer.resolve(courses);
},(err) => { defer.reject(err) });
return defer.promise;
}

getCourseSections(course: core.ICourse) {
return this.list.filter((courseS) => {
return ((courseS.cid)==course.cid);
});
}

getSectionsForSemester(eid: string) {
return this.list.filter((courseS) => {
return ((courseS.eid)==eid);
});

}

refresh() {
var defer=this.$q.defer();
this.resource.query((courses) => {
this.list=courses;
defer.resolve(courses);
},(err) => { defer.reject(err) });
return defer.promise;
}

removeCourse(course: ICourseSection) {
return course.$remove();
}

getAllCourses(eid: string) {
return this.resource.get({ eid: eid }).$promise;
}


static $inject=['$resource','$q','$http'];

constructor($resource: ng.resource.IResourceService,
private $q: ng.IQService,
private $http: ng.IHttpService) {
this.resource=core.CourseSections.Resource($resource);

}
}

}
