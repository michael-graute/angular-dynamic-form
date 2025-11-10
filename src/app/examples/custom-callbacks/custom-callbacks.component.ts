import {Component} from '@angular/core';
import {DynamicFormComponent, CustomButtonCallBackPayload, FormConfig} from "dynamic-form";
import {FormGroup} from "@angular/forms";
import {ConfigDisplayComponent} from "../../helpers/config-display/config-display.component";
import {prettyPrintJson} from "pretty-print-json";
import {ModalService} from "../../helpers/modal/modal.service";
import {PrismComponent} from "../../helpers/prism/prism.component";

@Component({
  selector: 'fg-custom-callbacks',
  imports: [
    DynamicFormComponent,
    ConfigDisplayComponent,
    PrismComponent
  ],
  templateUrl: './custom-callbacks.component.html',
  styleUrl: './custom-callbacks.component.scss'
})
export class CustomCallbacksComponent {
  constructor(public modalService: ModalService) {
  }

  formConfig: FormConfig = {
    elements: [
      {
        key: "title",
        label: "Article Title",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required",
            errorMessage: "Article title is required"
          },
          {
            name: "minLength",
            value: 5,
            errorMessage: "Title must be at least 5 characters"
          }
        ]
      },
      {
        key: "author",
        label: "Author Name",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required",
            errorMessage: "Author name is required"
          }
        ]
      },
      {
        key: "category",
        type: "select",
        label: "Category",
        settings: {
          floatingLabel: true
        },
        options: [
          {
            label: "Please select",
            value: ""
          },
          {
            label: "Technology",
            value: "tech"
          },
          {
            label: "Science",
            value: "science"
          },
          {
            label: "Business",
            value: "business"
          },
          {
            label: "Lifestyle",
            value: "lifestyle"
          }
        ],
        validators: [
          {
            name: "required",
            errorMessage: "Category is required"
          }
        ]
      },
      {
        key: "content",
        label: "Article Content",
        type: "input",
        controlType: "text",
        settings: {
          floatingLabel: true
        },
        validators: [
          {
            name: "required",
            errorMessage: "Article content is required"
          },
          {
            name: "minLength",
            value: 50,
            errorMessage: "Content must be at least 50 characters"
          }
        ]
      },
      {
        key: "tags",
        type: "input",
        controlType: "text",
        label: "Tag",
        multipleLabel: "Tags (Multiple Values)",
        helpText: "Add tags to categorize your article",
        multiple: true,
        value: ["angular"],
        settings: {
          floatingLabel: true,
          addButton: {
            label: "Add Tag",
            icon: "bi-plus-circle"
          },
          removeButton: {
            label: "Remove",
            icon: "bi-dash-circle"
          }
        },
        validators: [
          {
            name: "required",
            errorMessage: "Tag is required"
          },
          {
            name: "minLength",
            value: 2,
            errorMessage: "Tag must be at least 2 characters"
          }
        ]
      }
    ],
    buttons: [
      {
        key: 'save-draft',
        type: "button",
        label: "Save Draft",
        icon: "bi-file-earmark",
        class: "btn-secondary",
        callback: {
          function: "saveDraft",
          params: [
            {
              status: "draft",
              autoSave: false
            }
          ]
        }
      },
      {
        key: 'preview',
        type: "button",
        label: "Preview",
        icon: "bi-eye",
        class: "btn-info",
        settings: {
          disableIfFormInvalid: true
        },
        callback: {
          function: "previewArticle"
        }
      },
      {
        key: 'reset',
        type: "reset",
        label: "Reset",
        icon: "bi-x-circle",
        class: "btn-warning",
        callback: {
          function: "formReset"
        }
      },
      {
        key: 'submit',
        type: "submit",
        label: "Publish",
        icon: "bi-check-circle",
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

  /**
   * Custom callback for saving draft
   * This demonstrates how custom callbacks receive parameters from the button configuration
   */
  saveDraft(payload: CustomButtonCallBackPayload): void {
    const formData = payload.form.getRawValue();
    const params = payload.callBack.params?.[0] || {};

    this.modalService.show({
      title: 'Draft Saved',
      size: 'modal-lg',
      bodyText: `
        <div class="alert alert-info">
          <h5>Draft saved successfully!</h5>
          <p><strong>Status:</strong> ${params.status || 'draft'}</p>
          <p><strong>Auto-save:</strong> ${params.autoSave !== undefined ? params.autoSave : false}</p>
        </div>
        <h6>Article Data:</h6>
        <pre>${prettyPrintJson.toHtml(formData)}</pre>
        <p class="text-muted mt-3">
          <small>Note: This is a demonstration. In a real application, the draft would be saved to a backend API.</small>
        </p>
      `,
    }, null);
  }

  /**
   * Custom callback for previewing article
   * This demonstrates a custom callback without parameters
   */
  previewArticle(payload: CustomButtonCallBackPayload): void {
    const formData = payload.form.getRawValue();

    this.modalService.show({
      title: 'Article Preview',
      size: 'modal-xl',
      bodyText: `
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">${formData.title || 'Untitled'}</h4>
          </div>
          <div class="card-body">
            <p class="text-muted">
              <strong>By:</strong> ${formData.author || 'Unknown Author'} |
              <strong>Category:</strong> ${formData.category || 'Uncategorized'}
            </p>
            ${formData.tags && formData.tags.length > 0 ? `
              <div class="mb-3">
                ${formData.tags.map((tag: string) => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
              </div>
            ` : ''}
            <div class="article-content">
              ${formData.content || '<em>No content</em>'}
            </div>
          </div>
        </div>
        <p class="text-muted mt-3">
          <small>This is a preview of how your article would appear to readers.</small>
        </p>
      `,
    }, null);
  }

  /**
   * Standard form submit handler
   */
  formSubmit(formGroup: FormGroup): void {
    this.modalService.show({
      title: 'Article Published',
      size: 'modal-lg',
      bodyText: `
        <div class="alert alert-success">
          <h5>Article published successfully!</h5>
          <p>Your article has been published and is now live.</p>
        </div>
        <h6>Published Article Data:</h6>
        <pre>${prettyPrintJson.toHtml(formGroup.getRawValue())}</pre>
        <p class="text-muted mt-3">
          <small>Note: In a real application, this would submit to a backend API and redirect to the published article.</small>
        </p>
      `,
    }, null);
  }

  /**
   * Standard form reset handler
   */
  formReset(formGroup: FormGroup): void {
    formGroup.reset();
    this.modalService.show({
      title: 'Form Reset',
      bodyText: '<p>The form has been reset to its initial state.</p>',
    }, null);
  }
}
