import {Component, OnInit} from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {JsonPipe, NgIf} from "@angular/common";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";

@Component({
  selector: 'fg-simple-ajax-form',
  imports: [
    DynamicFormComponent,
    JsonPipe,
    NgIf
  ],
  templateUrl: './simple-ajax-form.component.html',
  styleUrl: './simple-ajax-form.component.scss'
})
export class SimpleAjaxFormComponent {
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
