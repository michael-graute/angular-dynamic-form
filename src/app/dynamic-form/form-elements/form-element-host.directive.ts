import {Directive, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[fgFormElementHost]',
  standalone: true
})
export class FormElementHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
