import { IUser } from './IUser';
import { rename } from 'fs';

/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';

export interface ICourse {
sid: string;
id: string;
name: string;
professor: string;
tas: Array<string>;
}

export interface ICourseInstance
extends Sequelize.Instance<ICourseInstance,ICourse>,ICourse { }

export interface ICourseModel
extends Sequelize.Model<ICourseInstance,ICourse> { }
