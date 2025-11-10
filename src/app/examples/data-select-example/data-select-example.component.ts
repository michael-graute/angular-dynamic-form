import {Component} from '@angular/core';
import {DynamicFormComponent, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";

@Component({
  selector: 'fg-data-select-example',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './data-select-example.component.html',
  styleUrl: './data-select-example.component.scss'
})
export class DataSelectExampleComponent {
  constructor(public modalService: ModalService) {}

  formConfig: FormConfig = {
    elements: [
      {
        type: "card",
        key: "async-dropdown-card",
        label: "Asynchronous Dropdown Options Demo",
        children: [
          {
            key: "assignedUser",
            label: "Assign to User",
            type: "data-select",
            helpText: "This dropdown loads user options from a mock API endpoint with caching and retry logic. It displays user names but stores only the user ID.",
            settings: {
              floatingLabel: true,
              asyncURL: "/user-list",
              valueKey: "id",
              labelKey: "name"
            },
            validators: [
              {
                name: "required",
                errorMessage: "Please select a user"
              }
            ]
          },
          {
            key: "department",
            label: "Department",
            type: "select",
            helpText: "For comparison, this is a regular select with static options",
            settings: {
              floatingLabel: true
            },
            options: [
              { value: "it", label: "IT" },
              { value: "sales", label: "Sales" },
              { value: "engineering", label: "Engineering" },
              { value: "marketing", label: "Marketing" },
              { value: "finance", label: "Finance" },
              { value: "hr", label: "Human Resources" }
            ],
            validators: [
              {
                name: "required"
              }
            ]
          },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            settings: {
              floatingLabel: true
            },
            options: [
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" }
            ],
            value: "medium"
          },
          {
            key: "description",
            label: "Task Description",
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
                value: 10,
                errorMessage: "Description must be at least 10 characters"
              }
            ]
          }
        ]
      }
    ],
    buttons: [
      {
        key: 'submit',
        type: "submit",
        label: "Create Task",
        icon: "bi-check-circle",
        class: "btn-success",
        settings: {
          disableIfFormInvalid: true
        },
        callback: {
          function: "formSubmit"
        }
      },
      {
        key: 'reset',
        type: "button",
        label: "Reset",
        icon: "bi-x-circle",
        class: "btn-secondary",
        callback: {
          function: "formReset"
        }
      }
    ]
  }

  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Form Submitted',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null)
  }

  formReset(formGroup: FormGroup): void {
    formGroup.reset();
  }
}
