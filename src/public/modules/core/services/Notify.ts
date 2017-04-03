/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="../../../../typings/globals/angular/index.d.ts" />

declare var Materialize: {
toast: Function;
}

module core {
'use strict';

export class Notify {

info(msg: string) {
Materialize.toast(msg,3000);
}

error(msg: string) {
Materialize.toast(msg,3000);
}

static $inject=[];

constructor(
) { }

}

}
