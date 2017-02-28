/// <reference path="../../../../typings/index.d.ts" />

import { update } from '../../../../app/routes/semester';
import { IUser } from '../../../../app/interfaces/IUser';
import { ICourse } from '../../../../app/interfaces/ICourse';


module core {
'use strict';


export interface ISemester extends ng.resource.IResource<ISemester> {
eid: string;
name: string;
courses: ICourse[];
admin: IUser;
current: boolean;
}

interface ISemesterResource extends ng.resource.IResourceClass<ISemester> {
update(params: Object,data: ISemester,success?: Function,error?: Function): ISemester;
}

export class Semesters {

static Resource($resource: ng.resource.IResourceService): ISemesterResource {
var url="/semesters/";
var resource=$resource("",{},{
'query': { method: 'GET',url: url,isArray: true },
'get': { method: 'GET',params: { id: "@id" },url: url+":id" },
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

add(sem: ISemester) {

/*    this.resource.save(sem, (semester: ISemester) => {
this.list.push(semester);
this.listById[semester.eid] = semester;
}, (err) => { reject(err) });
*/
}

update(sem: ISemester) {

}

}
}
