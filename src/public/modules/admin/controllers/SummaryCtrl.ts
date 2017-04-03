
/// <reference path="../../../../typings/index.d.ts" />


/**
 * Summary controller. Hooks up in the vain view.
 */
module admin {
'use strict';

/**
* Summary of ratings
*/
interface IRatingSummary {
assigned: number; // number of students assigned
rStat: { [id: number]: number }; // ratingID => number
}

export class SummaryCtrl {
private loading: boolean=false;
private semester: core.ISemester;
private faculty: core.IUser[]=[];
private facultyStats: { [email: string]: IRatingSummary }={};

private recommendations: { [ID: number]: string }={}; // the reccomendation map 


private insertGridPos=6; // position where to insert the individual stars


/**
* Load saved data for the selected directory
*/
load() {
var self=this;
this.loading=true;
var students: any[];
var studentsByAppId: { [appID: string]: any };
this.Semesters.getData()
.then((obj: Object) => {
students=obj['students'];
studentsByAppId=_.indexBy(students,(s: any) => { return s.appID; });
// count the total assigned and create the faculty stats
students.forEach((student: any) => {
if(student.faculty)
student.faculty.forEach((email: string) => {
var stat=self.facultyStats[email];
if(stat)
stat.assigned++;
else
self.facultyStats[email]={ assigned: 1,rStat: {} };
});
});
},() => { this.loading=false; })
.then(() => {
self.Scores.allScores(self.Semesters.current().eid)
.then((scores: core.IScore[]) => {
// first record the scores
scores.forEach((score: core.IScore) => {
var student: any=studentsByAppId[score.appID];
var rating=score.rating||-1; // no rating becomes -1
if(student.faculty)
student.faculty.forEach((email: string) => {
var stat=self.facultyStats[email];
stat.rStat[rating]=stat.rStat[rating]? stat.rStat[rating]+1:1;
});
});

console.log(self.facultyStats);
// let's make the table now
var table=[];
for(var email in this.facultyStats) {
var stat=this.facultyStats[email];
var row: any=_.clone(stat.rStat);
row.faculty=this.Users.byEmail(email).nickName;
row.total=stat.assigned;
table.push(row);
}
this.grid.data=table;
self.loading=false;
});
});
}

static $inject=['$mdDialog','$mdToast','Auth','Users','Semesters'];

constructor(
private $mdDialog: ng.material.IDialogService,
private $mdToast: ng.material.IToastService,
private Auth: core.Auth,
private Users: core.Users,
private Semesters: core.Semesters,
) {
var self=this;

// Bring refresh semester info
this.Semesters.refresh().then(() => {
this.semester=this.Semesters.current();
}).then(() => {
// setup recommendations
this.recommendations={};
this.recommendations[-1]="Unrated";
var pos=this.insertGridPos;
Semesters.current().recommendations.forEach(
(rec: core.IRecommendation) => {
// extract info we need to deal with recommendations
this.recommendations[rec.id]=rec.name;
self.grid.columnDefs.splice(pos,0,{
field: ""+rec.id,displayName: rec.name,
headerTooltip: "Number of students with "+rec.name+" rating",
maxWidth: 120
});
});


self.load();
});

// Refresh faculty info
this.Users.refresh().then(() => {
this.faculty=this.Users.getFaculty();
});
}
}
}
