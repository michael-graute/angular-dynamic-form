import {Component} from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";
import {FormConfig} from "../../dynamic-form/dynamic-form.types";
import {DynamicFormService} from "../../dynamic-form/dynamic-form.service";

@Component({
  selector: 'fg-edit-user-form',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.scss'
})
export class EditUserFormComponent {
  constructor(
    public modalService: ModalService,
    private dynamicFormService: DynamicFormService
  ) {}

  formConfig: FormConfig = {
    elements: [
      {
        type: "card",
        key: "user-info-card",
        label: "User Information",
        children: [
          {
            type: "row",
            key: "name-row",
            children: [
              {
                type: "col",
                key: "gender-col",
                class: "col-12 col-md-3",
                children: [
                  {
                    type: "select",
                    key: "gender",
                    label: "Gender",
                    settings: {
                      floatingLabel: true
                    },
                    options: [
                      { label: "Mr.", value: "male" },
                      { label: "Mrs.", value: "female" },
                      { label: "Diverse", value: "diverse" }
                    ],
                    validators: [{ name: "required" }]
                  }
                ]
              },
              {
                type: "col",
                key: "firstname-col",
                class: "col-12 col-md-4",
                children: [
                  {
                    key: "firstname",
                    label: "First Name",
                    type: "input",
                    controlType: "text",
                    settings: {
                      floatingLabel: true
                    },
                    validators: [
                      { name: "required" },
                      { name: "minLength", value: 2 }
                    ]
                  }
                ]
              },
              {
                type: "col",
                key: "lastname-col",
                class: "col-12 col-md-5",
                children: [
                  {
                    key: "lastname",
                    label: "Last Name",
                    type: "input",
                    controlType: "text",
                    settings: {
                      floatingLabel: true
                    },
                    validators: [
                      { name: "required" },
                      { name: "minLength", value: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "row",
            key: "contact-row",
            children: [
              {
                type: "col",
                key: "email-col",
                class: "col-12 col-md-6",
                children: [
                  {
                    key: "email",
                    label: "Email Address",
                    type: "input",
                    controlType: "email",
                    settings: {
                      floatingLabel: true
                    },
                    validators: [
                      { name: "required" },
                      { name: "email" }
                    ]
                  }
                ]
              },
              {
                type: "col",
                key: "phone-col",
                class: "col-12 col-md-6",
                children: [
                  {
                    key: "phone",
                    label: "Phone Number",
                    type: "input",
                    controlType: "tel",
                    settings: {
                      floatingLabel: true
                    }
                  }
                ]
              }
            ]
          },
          {
            type: "formGroup",
            key: "address",
            label: "Address",
            children: [
              {
                key: "street",
                label: "Street",
                type: "input",
                controlType: "text",
                settings: {
                  floatingLabel: true
                }
              },
              {
                type: "row",
                key: "city-row",
                children: [
                  {
                    type: "col",
                    key: "city-col",
                    class: "col-12 col-md-8",
                    children: [
                      {
                        key: "city",
                        label: "City",
                        type: "input",
                        controlType: "text",
                        settings: {
                          floatingLabel: true
                        }
                      }
                    ]
                  },
                  {
                    type: "col",
                    key: "zip-col",
                    class: "col-12 col-md-4",
                    children: [
                      {
                        key: "zip",
                        label: "ZIP Code",
                        type: "input",
                        controlType: "text",
                        settings: {
                          floatingLabel: true
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: "card",
        key: "contacts-card",
        label: "Emergency Contacts",
        children: [
          {
            key: "contacts",
            type: "repeater",
            label: "Contact Information",
            children: [
              {
                key: "name",
                type: "input",
                label: "Contact Name",
                settings: {
                  floatingLabel: true
                },
                validators: [{ name: "required" }]
              },
              {
                key: "relationship",
                type: "select",
                label: "Relationship",
                settings: {
                  floatingLabel: true
                },
                options: [
                  { value: "spouse", label: "Spouse" },
                  { value: "parent", label: "Parent" },
                  { value: "sibling", label: "Sibling" },
                  { value: "friend", label: "Friend" },
                  { value: "other", label: "Other" }
                ]
              },
              {
                key: "contactPhone",
                type: "input",
                controlType: "tel",
                label: "Phone",
                settings: {
                  floatingLabel: true
                }
              }
            ],
            validators: [
              { name: "minItems", value: 1, errorMessage: "At least one emergency contact is required" },
              { name: "maxItems", value: 5, errorMessage: "Maximum 5 emergency contacts allowed" }
            ],
            value: [
              { name: "", relationship: "", contactPhone: "" }
            ]
          }
        ]
      },
      {
        type: "card",
        key: "additional-emails-card",
        label: "Additional Email Addresses",
        children: [
          {
            key: "additionalEmails",
            label: "Email",
            type: "input",
            controlType: "email",
            multiple: true,
            multipleLabel: "Additional Emails",
            settings: {
              floatingLabel: true
            },
            validators: [
              { name: "email" }
            ],
            value: []
          }
        ]
      }
    ],
    buttons: [
      {
        key: 'loadData',
        type: "button",
        label: "Load User Data",
        icon: "bi-cloud-download",
        class: "btn-primary me-2",
        callback: {
          function: "loadUserData"
        }
      },
      {
        key: 'submit',
        type: "submit",
        label: "Update User",
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
        key: 'cancel',
        type: "button",
        label: "Cancel",
        icon: "bi-x-circle",
        class: "btn-secondary",
        callback: {
          function: "formCancel"
        }
      }
    ]
  }

  /**
   * Loads user data from the mock API endpoint
   */
  loadUserData(): void {
    this.dynamicFormService.loadFormData('/edit-user-data');
  }

  /**
   * Handles form submission
   */
  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Updated User Data',
      size: 'modal-lg',
      bodyText: '<pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null)
  }

  /**
   * Handles form cancellation
   */
  formCancel(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Cancel Confirmation',
      bodyText: 'Are you sure you want to cancel editing? Any unsaved changes will be lost.',
    }, null)
  }
}
