
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

addCourseSection(sid: string,cid: string,eid: string,BRPD: string,enrollment: number,TAs: string) {
return this.schema.create({
sid: sid,
cid: cid,
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

updateCourseSection(sid: string,cid: string,eid: string,BRPD: string,enrollment: number,TAs: string) {
return this.schema.update({
sid: sid,
cid: cid,
eid: eid,
BRPD: BRPD,
enrollment: enrollment,
TAs: TAs
},{
where: {
cid: cid,
},
fields: ['completed']
}).then((res) => {
return this.schema.findById(sid);
});
}


constructor(private db: Sequelize.Connection) {
this.schema=db.define<ICourseSection.ICourseSectionInstance,ICourseSection.ICourseSection>("CourseSection",{
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
