import { Component } from '@angular/core';
import {CustomButtonCallBackPayload, DynamicFormComponent, DynamicFormService, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";

@Component({
  selector: 'fg-home',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  counter: number = 0;
  formConfig: FormConfig | undefined = undefined;

  constructor(private dynamicFormService: DynamicFormService, private modalService: ModalService) {
  }

  formConfigLoaded(formConfig: FormConfig) {
    this.formConfig = formConfig;
  }

  addElement(): void {
    this.counter++;
    this.dynamicFormService.addElement(
      {
        "key": "fooNameFormGroup" + this.counter,
        "label": "Foo Name "  + this.counter,
        "floatingLabel": true,
        "type": "input",
        "controlType": "text",
        "value": "Foooooooo"
      }, 'form-group'
    )
    this.dynamicFormService.addElement(
      {
        'key': 'newTabPane' + this.counter,
        'type': 'tabPane',
        'label': 'New Tab' + this.counter,
        children: [
          {
            "key": "newFieldset" + this.counter,
            "label": "New Fieldset" + this.counter,
            "type": "fieldset",
            "children": [
              {
                "key": "newTab" + this.counter,
                "type": "formGroup",
                "children": [
                  {
                    key: 'newRow' + this.counter,
                    type: 'row',
                    children: [
                      {
                        key: 'newCol1' + this.counter,
                        type: 'col',
                        children: [
                          {
                            "key": "fooName" + this.counter,
                            "label": "Foo Name "  + this.counter,
                            "floatingLabel": true,
                            "type": "input",
                            "controlType": "text",
                            "value": "Foooooooo"
                          }
                        ]
                      },
                      {
                        key: 'newCol2' + this.counter,
                        type: 'col',
                        children: [
                          {
                            "key": "fooMail" + this.counter,
                            "label": "Foo Mail " + this.counter,
                            "floatingLabel": true,
                            "type": "input",
                            "controlType": "email",
                            "value": "Foo@bar.baz",
                            "validators": [
                              {
                                "name": "email"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
            ]
          }
        ]
      }
      ,'fieldset2TabContainer')
    this.dynamicFormService.addElement(
      {
        "key": "fooNameDynamicForm" + this.counter,
        "label": "Foo Name "  + this.counter,
        "floatingLabel": true,
        "type": "input",
        "controlType": "text",
        "value": "Foooooooo"
      }, 'dynamicForm'
    )
  }

  deleteElement(): void {
    this.dynamicFormService.removeElement('newTabPane' + this.counter);
    this.dynamicFormService.removeElement('fooNameFormGroup' + this.counter);
    this.dynamicFormService.removeElement('fooNameDynamicForm' + this.counter);
    this.counter--;
  }

  customCallBack(payload: CustomButtonCallBackPayload) {
    if(payload.callBack.function === 'loadRemoteData') {
      this.loadRemoteData(payload.callBack.params)
      return
    }
    console.log('onCustomCallBack', payload);
  }

  formSubmit(form: FormGroup) {
    this.modalService.show({
      title: 'Form Values',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(form.getRawValue()) + '</pre>',
    }, null)
  }

  formCancel(form: FormGroup) {
    console.log('onFormCancel', form.getRawValue());
  }

  formReset(form: FormGroup) {
    console.log('onFormReset', form.getRawValue());
    //this.dynamicFormService.reloadForm('/get-form')
  }

  loadRemoteData(params: any) {
    this.dynamicFormService.loadFormData(params.url)
  }
}
