/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as config from 'config';

import * as staticRoutes from './routes/static';
import * as authRoutes from './routes/auth';
import * as todosRoutes from './routes/todos';
import * as semesterRoutes from './routes/semester';
import * as userRoutes from './routes/users';

import { sequelize } from './models';

// Set up express and Socket.IO
var app=express();
var server=require('http').createServer(app);

// Primary factor verifier
function primaryFactorIn(req: express.Request,res: express.Response,next: Function) {
console.log("Im here");
if(req.user) { // passport filled in the user
next();
} else {
res.status(401).send("Must be logged in to use this route.");
}
}


var sessionCookie: any=config.get("sessionCookie");

var Store=require('express-sequelize-session')((<any>session).Store);
app.use(session({
name: "2Q2R",
saveUninitialized: true,
resave: true,
secret: <string>config.get("sessionSecret"),
cookie: {
maxAge: sessionCookie.maxAge,
httpOnly: sessionCookie.httpOnly,
secure: sessionCookie.secure // && config.secure.ssl
},
store: new Store(sequelize)
}));

app.use(function(req,res,next) {
res.header('Access-Control-Allow-Headers','Content-Type');
res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
res.header('Access-Control-Allow-Origin','*');
next();
});

app.use(bodyParser.json());

// Passport requirements
app.use(passport.initialize());
app.use(passport.session());

// Pretty logs
app.use(morgan('dev'));

// All other routes are static
app.use(express.static('public'));


app.route('/admin.html').get(staticRoutes.admin);
app.route('/faculty.html').get(staticRoutes.faculty);
app.route('/student.html').get(staticRoutes.student);

// Express static routes
app.route('/').get(staticRoutes.index);


app.route('/register').post(authRoutes.register);

app.route('/loginAdmin').post(passport.authenticate('local',{ session: true }),authRoutes.loginAdmin);
app.route('/loginStudent').post(passport.authenticate('local',{ session: true }),authRoutes.loginStudent);
app.route('/logout').get(primaryFactorIn,authRoutes.logout);


// Todos CRUD routes. Require full session
app.route('/todo').get(primaryFactorIn,todosRoutes.get); // all of user's todos
app.route('/todo').post(primaryFactorIn,todosRoutes.create);
app.route('/adminMain').get(primaryFactorIn,authRoutes.confirmAdmin,semesterRoutes.get);
app.route('/todo/:id').put(primaryFactorIn,todosRoutes.update);
app.route('/todo/:id').delete(primaryFactorIn,todosRoutes.remove);

app.route('/users').get(userRoutes.isAuthorized,userRoutes.list);
app.route('/users').post(userRoutes.isAdmin,userRoutes.addUser);
app.route('/users/:userID').put(userRoutes.isAdmin,userRoutes.updateFaculty);

//app.param('id',semesterRoutes.semesterByID);
//app.route('/semesters').get();
app.route('/semesters').get(userRoutes.isAdmin,semesterRoutes.list);
app.route('/semesters').post(userRoutes.isAdmin,semesterRoutes.create);

app.route('/semesters/:id').put(userRoutes.isAdmin,semesterRoutes.update);

app.route('/courses').post(userRoutes.isAdmin,semesterRoutes.createCourse);
app.route('/courses').get(userRoutes.isAdmin,semesterRoutes.listCourses);
app.route('/courses/:eid').get(userRoutes.isAdmin,semesterRoutes.listCourses);

//app.route('/studentprofiles').post(userRoutes.addStudentProfile);
// This is critical. Without it, the schema is not created
sequelize.sync();

// Listen on desired port
var port=config.get("port");
server.listen(port);

console.log("Server started on port:"+port);
