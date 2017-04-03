
import { IUser } from './IUser';
import { rename } from 'fs';

/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';

export interface IRecommendation {
id: string;
facultyName: string;
studentName: string;
cid: string;
eid: string;
approved: boolean;
}

export interface ICourseInstance
extends Sequelize.Instance<ICourseInstance,IRecommendation>,IRecommendation { }

export interface ICourseModel
extends Sequelize.Model<ICourseInstance,IRecommendation> { }
