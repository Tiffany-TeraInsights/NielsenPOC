//import { DataTypes } from '~sequelize';
import { singularize } from '~sequelize/lib/utils';
/// <reference path="../interfaces/ICourse.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import { hashSync,compareSync } from "bcryptjs";

import * as IUser from '../interfaces/IUser'
import * as ICourse from '../interfaces/ICourse';
import * as ISemester from "../interfaces/ISemester";
import * as IRecommendation from '../interfaces/IRecommendation';

export class RecommendationSchema {
private schema: IRecommendation.IRecommendationModel;

getModel() {
return this.schema;
}

getAll() {
return this.schema.all();
}

get(id: string) {
return this.schema.findAll({
where: {
id: id
}
});
}

addRecommendation(id: string,faculty: string,student: string,cid: string,sid: string,eid: string,taType: string,approved: string,description: string) {
return this.schema.create({
id: id,
faculty: faculty,
student: student,
cid: cid,
sid: sid,
eid: eid,
taType: taType,
approved: approved,
description: description
});
}

removeRecommendation(id: string) {
return this.schema.destroy({
where: { id: id }
});
}

update(id: string,faculty: string,student: string,cid: string,sid: string,eid: string,taType: string,approved: string,description: string) {
console.log("update faculty "+faculty);
return this.schema.update({
id: id,
faculty: faculty,
student: student,
cid: cid,
sid: sid,
eid: eid,
taType: taType,
approved: approved,
description: description
},{
where: {
id: id,
}
}).then((res) => {
console.log(res);
console.log("schema +"+res[1]);
});
}

constructor(private db: Sequelize.Connection) {
this.schema=db.define<IRecommendation.IRecommendationInstance,IRecommendation.IRecommendation>("Recommendation",{
"id": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": true
},
'faculty': {
"type": Sequelize.STRING(64),
"allowNull": false,
},
"student": {
"type": Sequelize.STRING(64),
"allowNull": false
},
"cid": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"sid": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"eid": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"taType": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"approved": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"description": {
"type": Sequelize.STRING(64),
"allowNull": true
}
},{
"tableName": "recommendations",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at",
});
}

}
