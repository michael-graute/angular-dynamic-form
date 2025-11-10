import { Component } from '@angular/core';
import {DynamicFormComponent, DynamicFormService, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {ModalService} from "../../helpers/modal/modal.service";
import {prettyPrintJson} from "pretty-print-json";

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

  loadFormData(evt: any) {
    this.dynamicFormService.loadFormData(evt.callBack.params.url)
  }

}
