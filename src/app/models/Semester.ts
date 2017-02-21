import { IUser, IUserInstance, IUserModel } from '../interfaces/IUser';

/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/ITodos.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from 'bluebird';
import * as uuid from 'node-uuid';

import * as ITodos from '../interfaces/ITodos';
import * as ISemester from '../interfaces/ISemester';
import * as ICourse from '../interfaces/ICourse';

/**
 * This implements Semester Schemas
 */

export class SemesterSchema {
    private schema: ISemester.ISemesterModel;


    getModel() {
        return this.schema;
    }

    addSemester(eid: string, admin: IUser, current: boolean) {
        return this.schema.create({
            eid: eid,
            name: null,
            courses: null,
            admin: admin,
            current: current
        });
    }

    removeSemester(eid: string) {
        return this.schema.destroy({
            where: { eid: eid }
        });
    }

    constructor(private db: Sequelize.Connection) {
        this.schema = db.define<ISemester.ISemesterInstance, ISemester.ISemester>("Semester", {
            "eid": {
                "type": Sequelize.STRING(64),
                "allowNull": false,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING(64),
                "allowNull": true
            },
            "courses": {
                "type": Sequelize.STRING(64),
                "allowNull": true,
            },
            "admin": {
                "type": Sequelize.STRING(64),
                "allowNull": false
            },
            "current": {
                "type": Sequelize.BOOLEAN,
                "allowNull": false
            }
        }, {
                "tableName": "semesters",
                "timestamps": true,
                "createdAt": "created_at",
                "updatedAt": "updated_at",
            });

    }
}
