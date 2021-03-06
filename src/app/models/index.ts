import { CourseSchema } from './Course';
import { SemesterSchema } from './Semester';
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/ITodos.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as config from 'config';

import { TodosSchema } from './Todos';
import { UsersSchema } from './Users';

var configDB: any = config.get("database");

export var sequelize = new Sequelize(configDB.db, configDB.username,
    configDB.password, configDB.options);

// Export classes and instances of used schemas
export { TodosSchema } from './Todos';
export var Todos = new TodosSchema(sequelize);
export { UsersSchema} from './Users';
export var Users = new UsersSchema(sequelize);
export { SemesterSchema } from './Semester';
export var Semesters = new SemesterSchema(sequelize);
export { CourseSchema } from './Course';
export var Courses = new CourseSchema(sequelize);


// connect schemas
Todos.connectUsers(Users.getModel());
Courses.connectSemester(Semesters.getModel());
