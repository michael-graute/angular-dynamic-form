import {Component} from '@angular/core';
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormElementHostDirective} from "../../form-element-host.directive";
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";

@Component({
    selector: 'fg-fieldset',
    imports: [
    FormElementHostDirective
],
    templateUrl: './fieldset.component.html',
    styleUrl: './fieldset.component.scss'
})
export class FieldsetComponent extends AbstractFormElementHostComponent<FieldsetComponent> implements DynamicFormElementInterface {

}
