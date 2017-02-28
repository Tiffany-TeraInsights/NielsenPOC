
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

get(id: string,sid: string) {
return this.schema.findAll({
where: {
id: id,
sid: sid
}
});
}

addCourse(sid: string,id: string,name: string,professor: string,tas: Array<string>) {
return this.schema.create({
sid: sid,
id: id,
name: name,
professor: professor,
tas: tas
});
}

removeCourse(id: string) {
return this.schema.destroy({
where: { id: id }
});
}

update(sid: string,id: string,name: string,professor: string,tas: Array<string>) {
return this.schema.update({
sid: sid,
id: id,
name: name,
professor: professor,
tas: tas
},{
where: {
id: id,
sid: sid
},
fields: ['completed']
}).then((res) => {
return this.schema.findById(id);
});
}

connectSemesters(semesters: ISemester.ISemesterModel) {
//    this.schema.belongsTo(semesters);
//    semesters.hasMany(this.schema);
}

constructor(private db: Sequelize.Connection) {
this.schema=db.define<ICourse.ICourseInstance,ICourse.ICourse>("Course",{
"sid": {
"type": Sequelize.STRING(128),
"allowNull": false
},
"id": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": true
},
"name": {
"type": Sequelize.STRING(64),
"allowNull": false
},
"professor": {
"type": Sequelize.STRING(64),
"allowNull": false,
},
"tas": {
"type": Sequelize.ARRAY(Sequelize.INTEGER),
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
