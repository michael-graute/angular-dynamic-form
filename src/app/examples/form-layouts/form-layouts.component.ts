import { Component } from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {JsonPipe, NgIf} from "@angular/common";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {FormGroup} from "@angular/forms";
import {prettyPrintJson} from "pretty-print-json";

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
  formConfigPretty: any = '';

  constructor(private dynamicFormService: DynamicFormService) {
  }

  formConfigLoaded(formConfig: FormConfig) {
    this.formConfig = formConfig;
    this.formConfigPretty = prettyPrintJson.toHtml(this.formConfig, {lineNumbers: false});
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
