import {Component} from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormArray, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormElementHostDirective} from "../../form-element-host.directive";

@Component({
  selector: 'fg-form-group',
  imports: [
    ReactiveFormsModule,
    FormElementHostDirective
  ],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss'
})
export class FormGroupComponent extends AbstractFormElementHostComponent<FormGroupComponent> implements DynamicFormElementInterface {

  override formGroup = new FormGroup({})

  override ngOnInit() {
    console.log(this.config?.settings)
    if(this.config?.settings.multiple) {
      this.form.addControl(this.id, new FormArray([this.formGroup]))
    } else {
      this.form.addControl(this.id, this.formGroup)
    }
    super.ngOnInit()
  }

}
