
module admin {
'use strict'

var admin=angular.module('GatorTA',[
'core','ui.codemirror',"hc.marked",
'ui.grid','ui.grid.resizeColumns','ui.grid.selection','ui.grid.exporter',
'ngAria','ngMaterial','ngSanitize','ngResource',
'ngFileUpload','md.data.table','ngMdIcons','pdf'])
.controller('AdminCtrl',AdminCtrl)
.controller('SummaryCtrl',SummaryCtrl)
.controller("SemesterCtrl",SemesterCtrl)
.controller("SemesterCreateCtrl",SemesterCreateCtrl)
.controller("FacultyCtrl",FacultyCtrl)
.controller("AddFacultyCtrl",AddFacultyCtrl)
.controller("TAManagementCtrl",TAManagementCtrl)
.controller("StudentsCtrl",StudentsCtrl)
.controller("AddStudentsCtrl",AddStudentsCtrl)
.controller("ConfirmationMsg",ConfirmationMsg)
.controller("StudentDetailCtrl",StudentDetailCtrl)


}
