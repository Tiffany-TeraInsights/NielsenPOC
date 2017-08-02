
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

addCourse(id: string,cid: string,eid: string,name: string,sections: string,credits: number,exam: string,cf: string,eep: boolean,wm: string,ge: string,enrollment: number,professors: string) {
return this.schema.create({
id: id,
cid: cid,
eid: eid,
name: name,
sections: sections,
credits: credits,
exam: exam,
cf: cf,
eep: eep,
wm: wm,
ge: ge,
enrollment: enrollment,
professors: professors,
});
}

removeCourse(id: string) {
return this.schema.destroy({
where: { id: id }
});
}

update(id: string,cid: string,eid: string,name: string,sections: string,credits: number,exam: string,cf: string,eep: boolean,wm: string,ge: string,enrollment: number,professors: string) {
return this.schema.update({
id: id,
cid: cid,
eid: eid,
name: name,
sections: sections,
credits: credits,
exam: exam,
cf: cf,
eep: eep,
wm: wm,
ge: ge,
enrollment: enrollment,
professors: professors,
},{
where: {
id: id,
},
fields: ['completed']
}).then((res) => {
return this.schema.findById(id);
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
"id": {
"type": Sequelize.STRING(64),
"allowNull": false,
"primaryKey": true
},
"cid": {
"type": Sequelize.UUID,
"allowNull": false,
"primaryKey": false
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
"sections": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"credits": {
"type": Sequelize.INTEGER,
"allowNull": true
},
"exam": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"cf": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"eep": {
"type": Sequelize.BOOLEAN,
"allowNull": true
},
"wm": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"ge": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"enrollment": {
"type": Sequelize.INTEGER,
"allowNull": true
},
"professors": {
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
