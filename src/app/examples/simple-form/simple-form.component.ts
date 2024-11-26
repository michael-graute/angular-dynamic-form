import {Component} from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";

@Component({
  selector: 'fg-simple-form',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './simple-form.component.html',
  styleUrl: './simple-form.component.scss'
})
export class SimpleFormComponent {
  constructor(public modalService: ModalService) {
  }

  formConfig: any = {
    buttons: [
      {
        key: 'submit',
        type: "submit",
        label: "Submit",
        icon: "bi-check",
        class: "btn-success",
        callback: {
          function: "formSubmit"
        }
      }
    ],
    elements: [
      {
        type: "select",
        key: "gender",
        label: "Gender",
        settings: {
          floatingLabel: true
        },
        options: [
          {
            label: "Mr.",
            value: "male"
          },
          {
            label: "Mrs.",
            value: "female"
          },
          {
            label: "Diverse",
            value: "diverse"
          }
        ]
      },
      {
        key: "firstname",
        label: "Firstname",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        }
      },
      {
        key: "lastname",
        label: "Lastname",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        }
      },
      {
        key: "email",
        label: "E-Mail Address",
        type: "input",
        controlType: "email",
        settings: {
          floatingLabel: true
        }
      }
    ]
  }

  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Form Values',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null)
  }
}
