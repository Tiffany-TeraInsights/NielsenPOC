/// <reference path="../../core/utils/LoadData.d.ts" />

module admin {
'use strict';

export class AddFacultyCtrl {
private newFaculty: core.IUser;
private csvSlot: number=0;

addFaculty(csvs: number) {
this.newFaculty.firstName=this.bulkData[csvs][0];
this.newFaculty.lastName=this.bulkData[csvs][1];
this.newFaculty.email=this.bulkData[csvs][2];
this.newFaculty.password=this.bulkData[csvs][3];
this.newFaculty.roles='faculty';
this.newFaculty.cid=null;
this.Users.add(this.newFaculty)
.then(() => {
console.log("User "+this.newFaculty+" added");
},(err) => {
console.log(err);
});
this.newFaculty=<core.IUser>{ firstName: "",lastName: "",email: "",password: "",roles: "",cid: "null" };
if(this.csvSlot<this.bulkData.length-1) {
this.csvSlot=this.csvSlot+1;
this.addFaculty(this.csvSlot);
}
else {
console.log("Adding Users Completed");
}
}

accept() {
this.$mdDialog.hide();
}

cancel() {
this.$mdDialog.cancel();
}

import(file: any) {
var self=this;
csvFileReader(file,(data: string) => {
/*for(let i=0;i<data.length;++i) {
// asume this is a new faculty
self.newFaculty.firstName=data[i][0];
self.newFaculty.lastName=data[i][1];
self.newFaculty.email=data[i][2];
self.newFaculty.password=data[i][3];
self.newFaculty.roles='faculty';
self.newFaculty.cid=null;
self.Users.add(self.newFaculty);
}
self.faculty=null;*/
this.bulkData=data;
this.addFaculty(this.csvSlot);
});
}



constructor(private $mdDialog: ng.material.IDialogService,
private faculty: core.IUser,
private Users: core.Users,
private bulkData: string) {
this.newFaculty=<core.IUser>{ firstName: "",lastName: "",email: "",password: "",roles: "",cid: null };
}
}


AddFacultyCtrl.$inject=["$mdDialog","faculty","Users"];
}
