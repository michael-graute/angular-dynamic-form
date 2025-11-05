import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormElementHostDirective} from "../../form-element-host.directive";

@Component({
  selector: 'fg-form-group',
  imports: [
    ReactiveFormsModule,
    FormElementHostDirective
  ],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent extends AbstractFormElementHostComponent<FormGroupComponent> implements DynamicFormElementInterface {

  override formGroup = new FormGroup({})

  override ngOnInit() {
      this.form.addControl(this.key, this.formGroup)
      super.ngOnInit()
  }

}
