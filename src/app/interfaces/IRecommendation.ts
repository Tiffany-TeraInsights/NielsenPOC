
/// <reference path="../../typings/index.d.ts" />
import * as Sequelize from 'sequelize';

export interface IRecommendation {
id: string;
faculty: string;
student: string;
cid: string;
sid: string;
eid: string;
taType: string;
approved: string;
description: string;
}

export interface IRecommendationInstance
extends Sequelize.Instance<IRecommendationInstance,IRecommendation>,IRecommendation { }

export interface IRecommendationModel
extends Sequelize.Model<IRecommendationInstance,IRecommendation> { }
