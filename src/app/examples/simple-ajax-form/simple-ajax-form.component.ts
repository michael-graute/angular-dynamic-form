import {Component} from '@angular/core';
import {DynamicFormComponent, DynamicFormService, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";

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
  asyncUrl: string = '/user-registration-form';

  constructor(private dynamicFormService: DynamicFormService, private modalService: ModalService) {
  }

  formConfigLoaded(formConfig: FormConfig) {
    this.formConfig = formConfig;
    console.log('Form configuration loaded from API:', formConfig);
  }

  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Registration Submitted',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null)
  }

  formCancel(formGroup: FormGroup): void {
    console.log('Form cancelled', formGroup.getRawValue());
    this.modalService.show({
      title: 'Registration Cancelled',
      bodyText: 'Your registration has been cancelled.',
    }, null);
  }

  loadFormData(evt: any) {
    this.dynamicFormService.loadFormData(evt.callBack.params.url)
  }

}
