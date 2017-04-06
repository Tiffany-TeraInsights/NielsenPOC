
/// <reference path="../../../typings/index.d.ts" />



/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module core {
'use strict';

var core=angular.module('core',[])
.service('Notify',Notify)
.service('Users',Users)
.service('Auth',Auth)
.service('Semesters',Semesters)
.service('Courses',Courses)
.service('StudentProfile',StudentProfile)
.service('CourseSections',CourseSections)
.controller('LoginCtrl',LoginCtrl)


}
