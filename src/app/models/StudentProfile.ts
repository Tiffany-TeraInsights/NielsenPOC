
import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import { hashSync,compareSync } from "bcryptjs";

import * as IUser from '../interfaces/IUser';
import * as IStudentProfile from '../interfaces/IStudentProfile';

var singleton: StudentProfileSchema;

export class StudentProfileSchema {
private schema: IStudentProfile.IStudentProfileModel;


getModel() {
return this.schema;
}

getAll() {
return this.schema.all();
}

addStudentProfile(email: string,studentType: string,FSS: boolean,GPA: string,testScores: string,courseList: string,courseListGrades: string,degrees: string,pastTAships: string) {
return this.schema.create({
email: email,
studentType: studentType,
FSS: FSS,
GPA: GPA,
testScores: testScores,
courseList: courseList,
courseListGrades: courseListGrades,
degrees: degrees,
pastTAships: pastTAships
});
}

constructor(private db: Sequelize.Connection) {
this.schema=db.define<IStudentProfile.IStudentProfileInstance,IStudentProfile.IStudentProfile>("Student Profile",{
"email": {
"type": Sequelize.STRING,
"primaryKey": true,
"allowNull": false
},
"studentType": {
"type": Sequelize.STRING,
"allowNull": true
},
"FSS": {
"type": Sequelize.STRING,
"allowNull": true
},
"GPA": {
"type": Sequelize.STRING,
"allowNull": true
},
"testScores": {
"type": Sequelize.STRING,
"allowNull": true
},
"courseList": {
"type": Sequelize.STRING,
"allowNull": true
},
"courseListGrades": {
"type": Sequelize.STRING,
"allowNull": true
},
"degrees": {
"type": Sequelize.STRING,
"allowNull": true
},
"pastTAships": {
"type": Sequelize.STRING,
"allowNull": true
}
},{
"tableName": "studentprofiles",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at"
});
}

}
