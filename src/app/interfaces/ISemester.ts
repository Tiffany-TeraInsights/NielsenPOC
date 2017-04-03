import { IUser } from './IUser';
import { ICourse } from './ICourse';
import { rename } from 'fs';
/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';


export interface ISemester {
eid: string; // semester ID from UF system
name: string; // displayable semester rename
admin: string;
current: boolean;
}

export interface ISemesterInstance
extends Sequelize.Instance<ISemesterInstance,ISemester>,ISemester { }

export interface ISemesterModel
extends Sequelize.Model<ISemesterInstance,ISemester> { }
