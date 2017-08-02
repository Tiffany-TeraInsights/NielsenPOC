
module student {
'use strict'

var student=angular.module('GatorTA',[
'core',
'ngAria','ngMaterial','ngSanitize','ngResource',
'ngFileUpload','md.data.table','ngMdIcons','pdf'])

.controller("StudentCtrl",StudentCtrl)
.controller("SummaryCtrl",SummaryCtrl)
.controller("ProfileCtrl",ProfileCtrl)
.controller("StudentProfileCtrl",StudentProfileCtrl)
.controller("TAAppCtrl",TAAppCtrl)
.controller("AppAdditionCtrl",AppAdditionCtrl)

}
