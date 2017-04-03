
import { UsersSchema } from '../models/Users';
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/express/index.d.ts" />
/// <reference path="../../typings/globals/passport/index.d.ts" />
/// <reference path="../../typings/globals/lodash/index.d.ts" />

import express=require('express');
import _=require('lodash');
import passport=require('passport');
import { Strategy as LocalStrategy } from "passport-local";

import IUser=require('../interfaces/IUser');

import { Users } from '../models';
import { StudentProfiles } from '../models';

//var APIStrategy=require('passport-localapikey').Strategy;
//var ChallengeStrategy=require('passport-challenge').Strategy;
var bootstrapRouteDisabled=false; // can we bootstrap the admin?

// Serialize session

passport.use(new LocalStrategy(
(username: string,password: string,done: Function) => {
console.log("Login: ",username,password);
Users.checkPasswd(username,password).then(
(user) => { // good password, ask for the keys of this user 
//                console.log("User: ", user);

done(null,user);
},(error) => {
console.log("Error: ",error);
done(null,false,{ message: error.message });
});
}));

passport.serializeUser(function(user,done) {
done(null,user);
});

passport.deserializeUser(function(user,done) {
done(null,user);
});


export function list(req: express.Request,res: express.Response) {
Users.getAll()
.then((users) => {
console.log(users);
res.json(users);
},(err) => {
res.status(404).send(err);
});
}

export function addUser(req: express.Request,res: express.Response) {
var firstName=req.body.firstName;
var lastName=req.body.lastName;
var email=req.body.email;
var passwd=req.body.password;
var roles=req.body.roles;
var cid=req.body.cid;

console.log("In the add user post");
console.log(req);

Users.register(firstName,lastName,email,passwd,roles,cid)
.then(
(user) => {
res.json(user);
},(err) => {
res.status(400).send(err);
});

}

export function addStudentProfile(req: express.Request,res: express.Response) {
var email=req.body.email;
var studentType=req.body.studentType;
var FSS=req.body.FSS;
var GPA=req.body.GPA;
var testScores=req.body.testScores;
var courseList=req.body.courseList;
var courseListGrades=req.body.courseListGrades;
var degrees=req.body.degrees;
var pastTAships=req.body.pastTAships;

StudentProfiles.addStudentProfile(email,studentType,FSS,GPA,testScores,courseList,courseListGrades,degrees,pastTAships)
.then((studentProfile) => {
res.json(studentProfile);
},(err) => {
res.status(400).send(err);
});
}

export function updateFaculty(req: express.Request,res: express.Response) {
var userID=req.params.userID;
var faculty=req.body;
User.findOne({
_id: userID
},(err,user) => {
if(err)
res.status(400).send(err);
else {
user.firstName=faculty.firstName||user.firstName;
user.lastName=faculty.lastName||user.lastName;
user.nickName=faculty.nickName||user.nickName;
user.email=faculty.email||user.email;
user.pubKey=faculty.pubKey||user.pubKey;

user.save((err,user2) => {
if(err)
res.status(400).send(err);
else
res.json(user);
});
}

});
}
/** 
 * Method for signing in admins and faculty
 */
export function signin(req: express.Request,res: express.Response,next: Function) {
passport.authenticate('localapikey',(err,user,info) => {
if(err||!user) {
res.status(400).send(info);
} else {
// Remove sensitive data before login
//user.challenge=undefined;
//user.signature=undefined;

req.login(user,(err) => {
if(err)
res.status(400).send(err);
else
res.json(user);
});
}
})(req,res,next);
}

/**
 * Determine if the user is an admin
 */
export function isAdmin(req: express.Request,res: express.Response,next: Function) {
console.log("checking to see if admin");
console.log(req.user+" "+req.user.roles);
if(req.user&&_.includes(req.user.roles,'admin')) {
console.log("Yay an admin!");
next();
} else {
res.status(403).json({
message: 'User is not authorized'
});
}
}


/** Determine if the user is authorized to perform any action */
export function isAuthorized(req: express.Request,res: express.Response,next: Function) {
if(req.user&&
(_.includes(req.user.roles,'admin')||
_.includes(req.user.roles,'faculty'))) {
next();
} else {
res.status(403).json({
message: 'User is not authorized'
});
}
}
