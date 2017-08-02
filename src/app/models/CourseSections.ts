
import { CHAR,STRING,TEXT,UUID } from '~sequelize/lib/data-types';
//import { DataTypes } from '~sequelize';
import { singularize } from '~sequelize/lib/utils';
/// <reference path="../interfaces/ICourseSection.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import { hashSync,compareSync } from "bcryptjs";

import * as IUser from '../interfaces/IUser'
import * as ICourse from '../interfaces/ICourse';
import * as ICourseSection from '../interfaces/ICourseSection';
import * as ISemester from "../interfaces/ISemester";

export class CourseSectionSchema {
private schema: ICourseSection.ICourseSectionModel;



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

addCourseSection(id: string,sid: string,cid: string,cName: string,eid: string,BRPD: string,enrollment: number,TAs: string) {
return this.schema.create({
id: id,
sid: sid,
cid: cid,
cName: cName,
eid: eid,
BRPD: BRPD,
enrollment: enrollment,
TAs: TAs
});
}

removeCourseSection(sid: string,cid: string,eid: string) {
return this.schema.destroy({
where: {eid: eid,
cid: cid,
sid: sid}
});
}

updateCourseSection(id: string,sid: string,cid: string,cName: string,eid: string,BRPD: string,enrollment: number,TAs: string) {
return this.schema.update({
id: id,
sid: sid,
cid: cid,
cName: cName,
eid: eid,
BRPD: BRPD,
enrollment: enrollment,
TAs: TAs
},{
where: {
id: id
},
}).then((res) => {
console.log(this.schema.findById(id));
return this.schema.findById(id);
});
}


constructor(private db: Sequelize.Connection) {
this.schema=db.define<ICourseSection.ICourseSectionInstance,ICourseSection.ICourseSection>("CourseSection",{
"id": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": true
},
"sid": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": false
},
"cid": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": false
},
"cName": {
"type": Sequelize.STRING(64),
"allowNull": false
},
'eid': {
"type": Sequelize.STRING(64),
"allowNull": false,
"primaryKey": false
},
"BRPD": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"enrollment": {
"type": Sequelize.INTEGER,
"allowNull": true
},
"TAs": {
"type": Sequelize.STRING(64),
"allowNull": true
}
},{
"tableName": "courseSections",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at",
});
}

}
