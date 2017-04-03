//import { DataTypes } from '~sequelize';
import { IUser,IUserInstance,IUserModel } from '../interfaces/IUser';

/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/ITodos.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from 'bluebird';
import * as uuid from 'node-uuid';

import * as ITodos from '../interfaces/ITodos';
import * as ISemester from '../interfaces/ISemester';
import * as ICourse from '../interfaces/ICourse';

/**
 * This implements Semester Schemas
 */

export class SemesterSchema {
private schema: ISemester.ISemesterModel;

connectCourses(courses: ICourse.ICourseModel) {
this.schema.hasMany(courses);
courses.belongsTo(this.schema);
}

getAll() {
return this.schema.all();
}


getModel() {
return this.schema;
}

get(eid: string) {
console.log("get + "+eid);
return this.schema.findAll({
where: { eid: eid }
});
}

getCourses(eid: string,sid: string) {
return this.schema.findAll({
where: { eid: sid }
});
}

addSemester(eid: string,name: string,admin: string,current: boolean) {

return this.db.transaction(
(transaction: Sequelize.Transaction) => {
return this.schema.create({
eid: eid,
name: name,
admin: admin,
current: current
},{ transaction: transaction });
}
)
}

updateSemester(eid: string,name: string,admin: string,current: boolean) {
return this.schema.update({
eid: eid,
name: name,
admin: admin,
current: current
},{
where: { eid: eid },
}).then((res) => {
return this.schema.findById(eid);
});
}

removeSemester(eid: string) {
return this.schema.destroy({
where: { eid: eid }
});
}

constructor(private db: Sequelize.Connection) {
this.schema=db.define<ISemester.ISemesterInstance,ISemester.ISemester>("Semester",{
"eid": {
"type": Sequelize.STRING(64),
"allowNull": false,
"primaryKey": true
},
"name": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"admin": {
"type": Sequelize.STRING(64),
"allowNull": false
},
"current": {
"type": Sequelize.BOOLEAN,
"allowNull": false
}
},{
"tableName": "semesters",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at",
});

}
}
