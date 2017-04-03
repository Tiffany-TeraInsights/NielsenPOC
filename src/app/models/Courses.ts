
import { CHAR,STRING,TEXT,UUID } from '~sequelize/lib/data-types';
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

export class CourseSchema {
private schema: ICourse.ICourseModel;



getModel() {
return this.schema;
}

getAll() {
return this.schema.all();
}

get(eid: string) {
return this.schema.findAll({
where: {
eid: eid
}
});
}

addCourse(cid: string,eid: string,name: string,enrollment: number,professor1: string,professor2: string) {
return this.schema.create({
cid: cid,
eid: eid,
name: name,
enrollment: enrollment,
professor1: professor1,
professor2: professor2
});
}

removeCourse(cid: string) {
return this.schema.destroy({
where: { cid: cid }
});
}

update(cid: string,eid: string,name: string,enrollment: number,professor1: string,professor2: string,semesterID: string) {
return this.schema.update({
cid: cid,
eid: eid,
name: name,
enrollment: enrollment,
professor1: professor1,
professor2: professor2,
},{
where: {
cid: cid,
},
fields: ['completed']
}).then((res) => {
return this.schema.findById(cid);
});
}

connectTAs(users: IUser.IUserModel) {
this.schema.hasMany(users);
users.belongsTo(this.schema);
//    this.schema.belongsTo(semesters);
//    semesters.hasMany(this.schema);
}

constructor(private db: Sequelize.Connection) {
this.schema=db.define<ICourse.ICourseInstance,ICourse.ICourse>("Course",{
"cid": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": true
},
'eid': {
"type": Sequelize.STRING(64),
"allowNull": false,
"primaryKey": true
},
"name": {
"type": Sequelize.STRING(64),
"allowNull": false
},
"enrollment": {
"type": Sequelize.INTEGER,
"allowNull": true
},
"professor1": {
"type": Sequelize.STRING(64),
"allowNull": false
},
"professor2": {
"type": Sequelize.STRING(64),
"allowNull": true
}
},{
"tableName": "courses",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at",
});
}

}
