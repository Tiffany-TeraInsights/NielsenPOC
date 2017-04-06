/// <reference path="../../typings/index.d.ts" />

import * as Sequelize from 'sequelize';

export interface IStudentProfile {
email: string;
studentType: string;
FSS: boolean;
GPA: string;
testScores: string;
courseList: string;
degrees: string;
pastTAships: string;
}

export interface IStudentProfileInstance
extends Sequelize.Instance<IStudentProfileInstance,IStudentProfile>,IStudentProfile { }


export interface IStudentProfileModel
extends Sequelize.Model<IStudentProfileInstance,IStudentProfile> { }
