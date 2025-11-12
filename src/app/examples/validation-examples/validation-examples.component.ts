import {Component} from '@angular/core';
import {DynamicFormComponent, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {ModalService} from "../../helpers/modal/modal.service";
import {prettyPrintJson} from "pretty-print-json";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";

@Component({
  selector: 'fg-validation-examples',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent
  ],
  templateUrl: './validation-examples.component.html',
  styleUrl: './validation-examples.component.scss'
})
export class ValidationExamplesComponent {
  constructor(public modalService: ModalService) {}

  formConfig: FormConfig = {
    elements: [
      {
        key: "username",
        label: "Username (required, minLength: 3, maxLength: 20)",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required",
            errorMessage: "Please enter a username"
          },
          {
            name: "minLength",
            value: 3,
            errorMessage: "Username must be at least {expected} characters (you entered {given})"
          },
          {
            name: "maxLength",
            value: 20,
            errorMessage: "Username cannot exceed {expected} characters (you entered {given})"
          }
        ],
        helpText: "Enter a username between 3-20 characters"
      },
      {
        key: "email",
        label: "Email Address (required, email format)",
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
            name: "email",
            errorMessage: "Please enter a valid email address"
          }
        ],
        helpText: "Standard email validation"
      },
      {
        key: "phone",
        label: "Phone Number (pattern: ###-###-####)",
        type: "input",
        controlType: "tel",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "pattern",
            value: "^\\d{3}-\\d{3}-\\d{4}$",
            errorMessage: "Phone number must match format XXX-XXX-XXXX"
          }
        ],
        helpText: "Format: 555-123-4567"
      },
      {
        key: "country",
        label: "Country (must be USA, Canada, or Mexico)",
        type: "select",
        settings: {
          floatingLabel: true
        },
        options: [
          { label: "Select a country...", value: "" },
          { label: "United States", value: "USA" },
          { label: "Canada", value: "Canada" },
          { label: "Mexico", value: "Mexico" },
          { label: "Brazil", value: "Brazil" }
        ],
        validators: [
          {
            name: "required"
          },
          {
            name: "inArray",
            value: ["USA", "Canada", "Mexico"],
            errorMessage: "Only North American countries are supported: {expected}"
          }
        ],
        helpText: "Select USA, Canada, or Mexico (Brazil will show error)"
      },
      {
        key: "age",
        label: "Age (min: 18, max: 30)",
        type: 'input',
        controlType: "number",
        validators: [
          {
            name: "minNumber",
            value: 18,
            errorMessage: "You must be at least {expected} years old (currently: {given})"
          },
          {
            name: "maxNumber",
            value: 30,
            errorMessage: "Maximum age of {expected} extended, (you are: {given} years old)"
          }
        ]
      },
      {
        key: "tags",
        label: "Tags (minItems: 2, maxItems: 5)",
        type: "input",
        controlType: "text",
        multiple: true,
        multipleLabel: "Add tags (min 2, max 5)",
        settings: {
          floatingLabel: true,
          addButton: {
            label: "Add Tag",
            icon: "bi-plus-circle"
          },
          removeButton: {
            label: "",
            icon: "bi-trash"
          }
        },
        validators: [
          {
            name: "minItems",
            value: 2,
            errorMessage: "Please add at least {expected} tags (currently: {given})"
          },
          {
            name: "maxItems",
            value: 5,
            errorMessage: "Maximum {expected} tags allowed (you have: {given})"
          }
        ],
        helpText: "Add between 2-5 tags using the Add button"
      },
      {
        key: "agreem",
        label: "I agree to the terms and conditions",
        type: "checkbox",
        value: false,
        validators: [
          {
            name: "required",
            errorMessage: "You must accept the terms to continue"
          }
        ]
      }
    ],
    buttons: [
      {
        key: "submit",
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
      },
      {
        key: "reset",
        type: "reset",
        label: "Reset",
        icon: "bi-arrow-clockwise",
        class: "btn-secondary",
        callback: {
          function: "formReset"
        }
      }
    ]
  };

  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Validation Success!',
      size: 'modal-lg',
      bodyText: '<p>All validators passed. Form values:</p><pre>' + prettyPrintJson.toHtml(formGroup.getRawValue()) + '</pre>',
    }, null);
  }

  formReset(formGroup: FormGroup): void {
    formGroup.reset();
    console.log('Form reset');
  }
}
