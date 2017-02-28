/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains the implementation of the authentication related routes
 * A lot of these routes pass over the info to the 2Q2R server for the functionality.
 */

import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";

var APIStrategy = require('passport-localapikey').Strategy;
var unirest = require('unirest');

import { Users } from '../models';


// Login challenge
passport.use(new LocalStrategy(
    (username: string, password: string, done: Function) => {
        console.log("Login: ", username, password);
        Users.checkPasswd(username, password).then(
            (user) => { // good password, ask for the keys of this user 
                //                console.log("User: ", user);

                done(null, user);
            }, (error) => {
                console.log("Error: ", error);
                done(null, false, { message: error.message });
            });
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// POST: /login
export function login(req: express.Request, res: express.Response) {
    res.status(200).send("2FA Successful");
};

// GET: /logout
export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.status(200).send("Successfully logged out");
};


// POST: /register 
export function register(req: express.Request, res: express.Response) {
    var userID = req.body.userID;
    var passwd = req.body.password;

    Users.register(userID, passwd)
        .then(
        (user) => {
            res.status(200).send("Registration successful");
        }, (err) => {
            res.status(400).send(err);
        });

};

export function confirmAdmin(req: express.Request, res: express.Response) {

    Users.confirmAdmin(req.user.userid)
        .then(
        (user) => {
            res.status(200).send("Authentication successful");
        }, (err) => {
            res.status(400).send(err);
        });
}
