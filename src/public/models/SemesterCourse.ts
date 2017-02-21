import { IUser } from '../../app/interfaces/IUser';
module semester {
    'use strict';

    export class SemesterCourse {
        constructor(
            public eid: string,
            public name: string,
            public professor: IUser,
            public tas: IUser[]
        ) { }
    }
}
