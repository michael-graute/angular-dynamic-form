import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CustomButtonCallBackPayload} from "./dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {DynamicFormService} from "./dynamic-form/dynamic-form.service";
import {ModalComponent} from "./helpers/modal/modal.component";


@Component({
    selector: 'fg-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ModalComponent],
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
