/// <reference path="../../typings/index.d.ts" />

import * as Sequelize from 'sequelize';

export interface IUser {
firstName: string;
lastName: string;
email: string;
password: string;
roles: string;
cid: string;
}

export interface IUserInstance
extends Sequelize.Instance<IUserInstance,IUser>,IUser { }


export interface IUserModel
extends Sequelize.Model<IUserInstance,IUser> { }
