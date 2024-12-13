import { Component } from '@angular/core';
import {CustomButtonCallBackPayload, DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {NgIf} from "@angular/common";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";
import {FormGroup} from "@angular/forms";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";

@Component({
  selector: 'fg-home',
  imports: [
    DynamicFormComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  counter: number = 0;

  constructor(private dynamicFormService: DynamicFormService, private modalService: ModalService) {
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
          }
        ]
      }
      ,'fieldset2TabContainer')
  }

  deleteElement(): void {
    this.dynamicFormService.removeElement('newTabPane' + this.counter);
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
    //this.dynamicFormService.reloadForm('/get-form')
  }

  loadRemoteData(params: any) {
    this.dynamicFormService.loadFormData(params.url)
  }
}
