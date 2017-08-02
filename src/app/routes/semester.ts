import { faculty } from './static';
import { ISemesterInstance } from '../interfaces/ISemester';

/// <reference path="../../typings/index.d.ts" />

import express=require('express');
import _=require('lodash');
import * as path from 'path';
import fs=require('fs');
//import { Semesters } from '../models';

//import Semester = require('../models/Semesters');
import { ISemester } from '../interfaces/ISemester';

import { CourseSections,Semesters } from '../models';

import { ICourse } from '../interfaces/ICourse';
import { Courses } from '../models';

import { Recommendations } from '../models';


export function get(req: express.Request,res: express.Response) {
Semesters.get(req.body.eid).then(
(semesters) => {
res.json(semesters);
},(err) => {
res.status(404).send(err);
}
);
}

export function create(req: express.Request,res: express.Response) {
var eid=req.body.eid;
var name=req.body.name;
var admin=req.body.admin;
var current=req.body.current;
console.log("create function:");
Semesters.addSemester(eid,name,admin,current)
.then(
(semester) => {
res.json(semester);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});

}

export function semesterByID(req: express.Request,res: express.Response,
next: Function,id: string) {
Semesters.get(
req.body.eid
),(err,semester: ISemester) => {
if(err) {
next(new Error("Could not find semester"));
err.status=401;
} else {
req.params.id=id;
next();
}
}
}

export function list(req: express.Request,res: express.Response) {
Semesters.getAll()
.then(
(semesters) => {
res.json(semesters);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});
}

export function listCourseSections(req: express.Request,res: express.Response) {
CourseSections.getAll()
.then(
(courseS) => {
res.json(courseS);
},
(err) => {
res.status(404).send(err);
});
}

export function listCourses(req: express.Request,res: express.Response) {
Courses.getAll()
.then(
(courses) => {
console.log("list courses"+courses);
res.json(courses);
},
(err) => {
res.status(404).send(err);
}
)
}

export function update(req: express.Request,res: express.Response) {
Semesters.updateSemester(
req.body.eid,
req.body.name,
req.body.admin,
req.body.current
).then(
(semester) => {
res.json(semester);
},(err) => {
console.log("Error: ",err);
res.status(404).send(err);
}
);
}

export function remove(req: express.Request,res: express.Response) {
Semesters.removeSemester(
req.params.id
).then(
() => {
res.status(200).send("OK");
},(err) => {
res.status(404).send(err);
}
)
}


export function createCourse(req: express.Request,res: express.Response) {
var id=req.body.id;
var cid=req.body.cid;
var eid=req.body.eid;
var name=req.body.name;
var sections=req.body.sections;
var credits=req.body.credits;
var exam=req.body.exam;
var cf=req.body.cf;
var eep=req.body.eep;
var wm=req.body.wm;
var ge=req.body.ge;
var enrollment=req.body.enrollment;
var professors=req.body.professors
// var semesterID = req.body.SemesterEid;
console.log("create function:");
Courses.addCourse(id,cid,eid,name,sections,credits,exam,cf,eep,wm,ge,enrollment,professors)
.then(
(course) => {
res.json(course);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});

}

export function updateCourse(req: express.Request,res: express.Response) {
var id=req.body.id;
var cid=req.body.cid;
var eid=req.body.eid;
var name=req.body.name;
var sections=req.body.sections;
var credits=req.body.credits;
var exam=req.body.exam;
var cf=req.body.cf;
var eep=req.body.eep;
var wm=req.body.wm;
var ge=req.body.ge;
var enrollment=req.body.enrollment;
var professors=req.body.professors;

Courses.update(id,cid,eid,name,sections,credits,exam,cf,eep,wm,ge,enrollment,professors)
.then(
(course) => {
res.json(course);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});
}


export function createCourseSection(req: express.Request,res: express.Response) {
var id=req.body.id;
var sid=req.body.sid;
var cid=req.body.cid;
var cName=req.body.cName;
var eid=req.body.eid;
var BRPD=req.body.BRPD;
var enrollment=req.body.enrollment;
var TAs=req.body.TAs;

CourseSections.addCourseSection(id,sid,cid,cName,eid,BRPD,enrollment,TAs)
.then(
(courseSection) => {
res.json(courseSection);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});
}

export function updateCourseSection(req: express.Request,res: express.Response) {
var id=req.body.id;
var sid=req.body.sid;
var cid=req.body.cid;
var cName=req.body.cName;
var eid=req.body.eid;
var BRPD=req.body.BRPD;
var enrollment=req.body.enrollment;
var TAs=req.body.TAs;

console.log(id+sid+cid+cName+eid+BRPD+enrollment+TAs);
CourseSections.updateCourseSection(id,sid,cid,cName,eid,BRPD,enrollment,TAs)
.then(
(courseSection) => {
console.log("CS"+courseSection)
res.json(courseSection);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});
}

export function addRecommendation(req: express.Request,res: express.Response) {
var id=req.body.id;
var faculty=req.body.faculty;
var student=req.body.student;
var cid=req.body.cid;
var sid=req.body.sid;
var eid=req.body.eid;
var taType=req.body.taType;
var approved=req.body.approved;
var description=req.body.description;

Recommendations.addRecommendation(id,faculty,student,cid,sid,eid,taType,approved,description)
.then((recommendation) => {
res.json(recommendation);
},(err) => {
res.status(404).send(err);
}
)
}

export function removeRecommendation(req: express.Request,res: express.Response) {
Recommendations.removeRecommendation(
req.params.id).then(
() => {
res.status(200).send("OK");
},(err) => {
res.status(404).send(err);
});
}

export function updateRecommendation(req: express.Request,res: express.Response) {
var id=req.body.id;
var faculty=req.body.faculty;
var student=req.body.student;
var cid=req.body.cid;
var sid=req.body.sid;
var eid=req.body.eid;
var taType=req.body.taType;
var approved=req.body.approved;
var description=req.body.description;
console.log("Route"+faculty);
Recommendations.update(id,faculty,student,cid,sid,eid,taType,approved,description)
.then((rec) => {
console.log(rec);
res.json(rec);
},(err) => {
res.status(404).send(err);
});
}

export function listRecommendations(req: express.Request,res: express.Response) {
Recommendations.getAll()
.then(
(rec) => {
console.log(rec);
res.json(rec);
},(err) => {
res.status(404).send(err);
});
}
