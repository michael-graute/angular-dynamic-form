import { Component } from '@angular/core';
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {ModalService} from "../../helpers/modal/modal.service";
import {FormGroup} from "@angular/forms";
import {prettyPrintJson} from "pretty-print-json";

@Component({
  selector: 'fg-form-inputs',
  imports: [
    ConfigDisplayComponent,
    DynamicFormComponent
  ],
  templateUrl: './form-inputs.component.html',
  styleUrl: './form-inputs.component.scss'
})
export class FormInputsComponent {
  formConfig: FormConfig | undefined = undefined;
  debug: boolean = false;

  constructor(private dynamicFormService: DynamicFormService, private modalService: ModalService) {
  }

  formConfigLoaded(formConfig: FormConfig) {
    this.formConfig = formConfig;
  }

  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Form Values',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null)
  }

  loadFormData(evt: any): void {
    this.dynamicFormService.loadFormData(evt.callBack.params.url)
  }

  toggleDebug(): void {
    this.debug = !this.debug;
  }
}
