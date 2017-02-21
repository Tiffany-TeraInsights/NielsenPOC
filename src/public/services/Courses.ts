import { IUser } from '../../app/interfaces/IUser';
/// <reference path="../../typings/index.d.ts" />

module semester {
    'use strict';

    /**
     * Interface for todo items
     */
    export interface ISemesterCourse extends ng.resource.IResource<ISemesterCourse> {
        id: string; // the item ID
        name: string; // displayable name
        professor: IUser;
        tas: IUser[];
        $update?: Function; // just so the compiler leaves us alone 
    }

    export interface ICourseResource extends ng.resource.IResourceClass<ISemesterCourse> {
        update(params: Object, data: ISemesterCourse, success?: Function, error?: Function): ISemesterCourse;
    }

    export class Courses {
        public resource: ICourseResource; // the resource to access backend

        static Resource($resource: ng.resource.IResourceService): ICourseResource {
            var resource = $resource("/semester/:eid", { id: '@id' }, {
                'update': { method: 'PUT', params: { id: '@id' } }
            });
            return <ICourseResource>resource;
        }

        static $inject = ['$resource', '$q', '$http'];

        constructor($resource: ng.resource.IResourceService,
            private $q: angular.IQService,
            private $http: angular.IHttpService) {
            this.resource = semester.Courses.Resource($resource);
        }

    }

}
