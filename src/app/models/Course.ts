import { singularize } from '~sequelize/lib/utils';
import { IUser } from "./../interfaces/IUser";
/// <reference path="../interfaces/ICourse.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import {hashSync, compareSync} from "bcryptjs";

import * as ICourse from '../interfaces/ICourse';
import * as ISemester from "../interfaces/ISemester";

export class CourseSchema {
    private schema: ICourse.ICourseModel;

    connectSemester(semester: ISemester.ISemesterModel) {
        this.schema.belongsTo(semester);
        semester.hasMany(this.schema);
    }

    getModel() {
        return this.schema;
    }

    addCourse(id: string, name: string, professor: IUser, tas: IUser[]) {
        return this.schema.create({
            id: id,
            name: name,
            professor: professor,
            tas: tas
        });
    }

    removeCourse(id: string) {
        return this.schema.destroy({
            where: { id: id }
        });
    }


    connectSemesters(semesters: ISemester.ISemesterModel) {
        //    this.schema.belongsTo(semesters);
        //    semesters.hasMany(this.schema);
    }

    constructor(private db: Sequelize.Connection) {
        this.schema = db.define<ICourse.ICourseInstance, ICourse.ICourse>("Course", {
            "id": {
                "type": Sequelize.UUID,
                "allowNull": false,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING(64),
                "allowNull": false
            },
            "professor": {
                "type": Sequelize.STRING(64),
                "allowNull": false,
            },
            "tas": {
                "type": Sequelize.STRING(64),
                "allowNull": true
            }
        }, {
                "tableName": "courses",
                "timestamps": true,
                "createdAt": "created_at",
                "updatedAt": "updated_at",
            });
    }

}
