import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CustomButtonCallBackPayload, DynamicFormComponent} from "./dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {DynamicFormService} from "./dynamic-form/dynamic-form.service";


@Component({
  selector: 'fg-root',
  standalone: true,
  imports: [RouterOutlet, DynamicFormComponent, JsonPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'form-generator';

  counter: number = 0;

  constructor(private dynamicFormService: DynamicFormService) {
  }

  addElement(): void {
    this.counter++;
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
    console.log('onCustomCallBack', payload);
  }

  formSubmit(form: FormGroup) {
    console.log('onFormSubmit', form.getRawValue());
  }

  formCancel(form: FormGroup) {
    console.log('onFormCancel', form.getRawValue());
  }

  formReset(form: FormGroup) {
    console.log('onFormReset', form.getRawValue());
  }

  loadFormData() {
    this.dynamicFormService.loadFormData('/get-form-data')
  }
}
