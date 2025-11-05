import {Component} from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {PrismComponent} from "../../helpers/prism/prism.component";

@Component({
  selector: 'fg-simple-form',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent,
    PrismComponent
  ],
  templateUrl: './simple-form.component.html',
  styleUrl: './simple-form.component.scss'
})
export class SimpleFormComponent {
  constructor(public modalService: ModalService) {
  }

  formConfig: FormConfig = {
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
        ],
        validators: [
          {
            name: "required"
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
        },
        validators: [
          {
            name: "required"
          },
          {
            name: "minLength",
            value: 2
          }
        ]
      },
      {
        key: "lastname",
        label: "Lastname",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required"
          },
          {
            name: "minLength",
            value: 2
          }
        ]
      },
      {
        key: "email",
        label: "E-Mail Address",
        type: "input",
        controlType: "email",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required"
          },
          {
            name: "email"
          }
        ]
      }
    ],
    buttons: [
      {
        key: 'submit',
        type: "submit",
        label: "Submit",
        icon: "bi-check",
        class: "btn-success",
        settings: {
          disableIfFormInvalid: true
        },
        callback: {
          function: "formSubmit"
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
