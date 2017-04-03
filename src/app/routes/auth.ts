/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains the implementation of the authentication related routes
 * A lot of these routes pass over the info to the 2Q2R server for the functionality.
 */

import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";

//var LocalStrategy=require('passport-local').Strategy;
var unirest=require('unirest');

import { Users } from '../models';


// Login challenge
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


// POST: /login
export function loginAdmin(req: express.Request,res: express.Response) {
var userEmail=req.user.email;

Users.getAccountByUserid(userEmail)
.then((user) => {
/*res.json(user);
},(err) => {
res.status(400).send(err);
})*/
if(user.roles=="admin"||"Admin") {
res.json(user);
}
else {
res.send(400).send("User Unauthorized");
}},(err) => {
res.send(400).send(err);
});
}

export function loginStudent(req: express.Request,res: express.Response) {
var userEmail=req.user.email;

Users.getAccountByUserid(userEmail)
.then((user) => {
/*res.json(user);
},(err) => {
res.status(400).send(err);
})*/
if(user.roles=="student"||"Student") {
res.json(user);
}
else {
res.send(400).send("User Unauthorized");
}},(err) => {
res.send(400).send(err);
});
}


// GET: /logout
export function logout(req: express.Request,res: express.Response) {
req.logout();
res.status(200).send("Successfully logged out");
};


// POST: /register 
export function register(req: express.Request,res: express.Response) {
var firstName=req.body.firstName;
var lastName=req.body.lastName;
var email=req.body.email;
var passwd=req.body.password;
var roles=req.body.roles;
var cid=req.body.cid;


Users.register(firstName,lastName,email,passwd,roles,cid)
.then(
(user) => {
res.status(200).send("Registration successful");
},(err) => {
res.status(400).send(err);
});

};

export function confirmAdmin(req: express.Request,res: express.Response) {

Users.confirmAdmin(req.user.email)
.then(
(user) => {
res.status(200).send("Authentication successful");
},(err) => {
res.status(400).send(err);
});
}

export function confirmStudent(req: express.Request,res: express.Response) {

Users.confirmStudent(req.user.email)
.then(
(user) => {
res.status(200).send("Authentication successful");
},(err) => {
res.status(400).send(err);
});
}
