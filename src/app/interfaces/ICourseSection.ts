import { IUser } from './IUser';
import { rename } from 'fs';

/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';

export interface ICourseSection {
sid: string;
cid: string;
eid: string;
BRPD: string;
enrollment: number;
TAs: string;
}

export interface ICourseSectionInstance
extends Sequelize.Instance<ICourseSectionInstance,ICourseSection>,ICourseSection { }

export interface ICourseSectionModel
extends Sequelize.Model<ICourseSectionInstance,ICourseSection> { }
