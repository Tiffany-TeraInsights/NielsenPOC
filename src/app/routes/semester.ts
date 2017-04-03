import { ISemesterInstance } from '../interfaces/ISemester';

/// <reference path="../../typings/index.d.ts" />

import express=require('express');
import _=require('lodash');
import * as path from 'path';
import fs=require('fs');
//import { Semesters } from '../models';

//import Semester = require('../models/Semesters');
import { ISemester } from '../interfaces/ISemester';

import { Semesters } from '../models';

import { ICourse } from '../interfaces/ICourse';
import { Courses } from '../models';


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
var cid=req.body.cid;
var eid=req.body.eid;
var name=req.body.name;
var enrollment=req.body.enrollment;
var professor1=req.body.professor1;
var professor2=req.body.professor2;
// var semesterID = req.body.SemesterEid;
console.log("create function:");
Courses.addCourse(cid,eid,name,enrollment,professor1,professor2)
.then(
(course) => {
res.json(course);
},
(err) => {
console.log("create function: "+err);
res.status(404).send(err);
});

}
