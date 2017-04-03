// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IUser.ts" />

import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import * as uuid from "node-uuid";
import { hashSync,compareSync } from "bcryptjs";

import * as IUser from '../interfaces/IUser';

var singleton: UsersSchema;

export class UsersSchema {
private schema: IUser.IUserModel;

/**
* Get access to the inner model. 
* 
* @returns IUser.IUserModel
*/
getModel() {
return this.schema;
}

getAll() {
return this.schema.all();
}

findAllFaculty() {
return this.schema.find({
where: { roles: 'faculty' }
});
}
/**
* Access the account ty email. This is the primary access method 
* 
* @param {string} email
* @returns
*/
getAccountByUserid(email: string) {
return this.schema.find({
where: { email: email }
});
}

/**
* Register a new user  
* 
* @param {string} email
* @param {string} password
* @returns {Promise<IUser>}
*/
register(firstName: string,lastName: string,email: string,password: string,roles: string,cid: string) {
let hashPwd=hashSync(password);
return this.schema.create({
firstName: firstName,
lastName: lastName,
email: email,
password: hashPwd,
roles: roles,
cid: cid
});
}

checkPasswd(email: string,password: string) {
return this.schema.find({
where: { email: email }
}).then((user: IUser.IUserInstance) => {
console.log("User: ",user);
if(!user)
throw Error("User not found");

if(compareSync(password,user.password))
return user;
else
throw Error("Incorrect password");
})
}

unregister(email: string) {
return this.schema.destroy({
where: { email: email }
});
}

confirmAdmin(email: string) {
return this.schema.find({
where: { email: email }
})
.then((user: IUser.IUserInstance) => {
if(!user)
throw Error("User not found");

if(user.roles=='admin')
return user;
else
throw Error("Unauthorized");
});

}

confirmStudent(email: string) {
return this.schema.find({
where: { email: email }
})
.then((user: IUser.IUserInstance) => {
if(!user)
throw Error("User not found");

if(user.roles=='student')
return user;
else
throw Error("Unauthorized");
});

}


constructor(private db: Sequelize.Connection) {
this.schema=db.define<IUser.IUserInstance,IUser.IUser>("User",{
"firstName": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"lastName": {
"type": Sequelize.STRING(64),
"allowNull": true
},
"email": {
"type": Sequelize.STRING(64),
"allowNull": false,
"primaryKey": true
},
"password": {
"type": Sequelize.STRING(128),
"allowNull": true
},
"roles": {
"type": Sequelize.STRING(128),
"allowNull": false
},
"cid": {
"type": Sequelize.STRING(128),
"allowNull": true
}
},{
"tableName": "users",
"timestamps": true,
"createdAt": "created_at",
"updatedAt": "updated_at",
});
}
}
