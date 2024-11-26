import {Component} from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";

@Component({
  selector: 'fg-simple-ajax-form',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './simple-ajax-form.component.html',
  styleUrl: './simple-ajax-form.component.scss'
})
export class SimpleAjaxFormComponent {
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
