import { Component } from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {JsonPipe, NgIf} from "@angular/common";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'fg-form-layouts',
    imports: [
        DynamicFormComponent,
        JsonPipe,
        NgIf
    ],
  templateUrl: './form-layouts.component.html',
  styleUrl: './form-layouts.component.scss'
})
export class FormLayoutsComponent {
  showConfig = false;
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

  toggleFormConfig() {
    this.showConfig = !this.showConfig;
  }

}
