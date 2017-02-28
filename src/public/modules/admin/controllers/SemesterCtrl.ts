
/// <reference path="../../../../typings/index.d.ts"/>
/// <reference path="../../../modules/core/services/Notify.ts"/>
/// <reference path="../../../modules/core/services/Auth.ts"/>

module admin {
'use strict';

export class SemesterCtrl {
private semesters: core.ISemester[]=[];
private current: core.ISemester;
activeEid: string;
private faculty: core.IUser[]=[];

setCurrent(semester: core.ISemester) {
this.Semesters.setCurrent(semester.eid);
this.activeEid=semester.eid;
}
}
}
