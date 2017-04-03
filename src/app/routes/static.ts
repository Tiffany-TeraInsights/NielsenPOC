/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as path from 'path';

export function index(req: express.Request,res: express.Response) {
res.sendFile(
path.join(__dirname,'../../public/modules/main/','index.html')
);
};

export function student(req: express.Request,res: express.Response) {
res.sendFile(
path.join(__dirname,'../../public/modules/student/','student.html')
);
};

export function faculty(req: express.Request,res: express.Response) {
res.sendFile(
path.join(__dirname,'../../public/modules/faculty/','faculty.html')
);
};

/**
 * Provides the entry point for administrator page. This is a full Angular App
 * No checking needs to be done on these since they do their own login.
 * @param {express.Request}  req HTTP Request
 * @param {express.Response} res HTTP Reply, static here
 */
export function admin(req: express.Request,res: express.Response) {
res.sendFile(
path.join(__dirname,'../../public/modules/admin/','admin.html')
);
};

export function registerComplete(req: express.Request,res: express.Response) {
res.sendFile(
path.join('../../public/modules/core/views/','register.return.html')
);
};
