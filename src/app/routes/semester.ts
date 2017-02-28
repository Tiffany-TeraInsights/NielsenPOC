
/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import {Semesters} from '../models';


export function get(req: express.Request, res: express.Response) {
    Semesters.get(req.body.eid).then(
        (semesters) => {
            res.json(semesters);
        }, (err) => {
            res.status(404).send(err);
        }
    );
}

export function create(req: express.Request, res: express.Response) {
    Semesters.addSemester(
        req.body.eid,
        req.body.name,
        req.user.userid,
        req.body.current
    ).then(
        (semesters) => {
            res.json(semesters);
        }, (err) => {
            res.status(404).send(err);
        }
        );
}

export function update(req: express.Request, res: express.Response) {
    Semesters.updateSemester(
        req.body.eid,
        req.body.name,
        req.body.courses,
        req.user.userid,
        req.body.current
    ).then(
        (courses) => {
            res.json(courses);
        }, (err) => {
            console.log("Error: ", err);
            res.status(404).send(err);
        }
        );
}

export function remove(req: express.Request, res: express.Response) {
    Semesters.removeSemester(
        req.params.id
    ).then(
        () => {
            res.status(200).send("OK");
        }, (err) => {
            res.status(404).send(err);
        }
        )
}
