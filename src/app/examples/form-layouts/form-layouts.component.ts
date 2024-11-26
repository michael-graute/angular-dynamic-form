import { Component } from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";

@Component({
  selector: 'fg-form-layouts',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './form-layouts.component.html',
  styleUrl: './form-layouts.component.scss'
})
export class FormLayoutsComponent {
  formConfig: FormConfig | undefined = undefined;

  constructor(private dynamicFormService: DynamicFormService) {
  }

  formConfigLoaded(formConfig: FormConfig) {
    this.formConfig = formConfig;
  }

  formSubmit(formGroup: FormGroup): void {
    console.log(formGroup.getRawValue());
  }

  loadFormData(evt: any) {
    this.dynamicFormService.loadFormData(evt.callBack.params.url)
  }

}
