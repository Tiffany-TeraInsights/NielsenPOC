import { IUser } from './IUser';
import { rename } from 'fs';

/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';

export interface ICourse {
id: string;
cid: string;
eid: string;
name: string;
sections: string;
credits: number;
exam: string;
cf: string;
eep: boolean;
wm: string;
ge: string;
enrollment: number;
professors: string;
}

export interface ICourseInstance
extends Sequelize.Instance<ICourseInstance,ICourse>,ICourse { }

export interface ICourseModel
extends Sequelize.Model<ICourseInstance,ICourse> { }
