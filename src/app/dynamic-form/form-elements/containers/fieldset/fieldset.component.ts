import {Component} from '@angular/core';
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormElementHostDirective} from "../../form-element-host.directive";
import {JsonPipe, NgIf} from "@angular/common";
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";

@Component({
  selector: 'fg-fieldset',
  standalone: true,
  imports: [
    FormElementHostDirective,
    NgIf,
    JsonPipe
  ],
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.component.scss'
})
export class FieldsetComponent extends AbstractFormElementHostComponent<FieldsetComponent> implements DynamicFormElementInterface {

}
