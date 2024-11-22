import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[fgFormElementHost]'
})
export class FormElementHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
