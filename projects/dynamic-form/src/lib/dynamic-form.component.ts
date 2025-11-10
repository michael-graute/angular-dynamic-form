import {ChangeDetectionStrategy, Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormElementHostDirective} from "./form-elements/form-element-host.directive";
import {DynamicFormElementInterface} from "./dynamic-form-element.interface";
import {FormElementMap} from "./form-elements.map";
import {FormButton, FormButtonCallback, FormConfig, FormElement} from "./dynamic-form.types";

import {DynamicFormService, ElementAddedPayload} from "./dynamic-form.service";
import {PerformanceMonitorService} from "./services/performance-monitor.service";
import {LoadingSpinnerComponent} from "./components/loading-spinner/loading-spinner.component";

export type CustomButtonCallBackPayload = {
  form: FormGroup,
  callBack: FormButtonCallback
}

@Component({
    selector: 'fg-dynamic-form',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    ReactiveFormsModule,
    FormElementHostDirective,
    LoadingSpinnerComponent
],
    templateUrl: './dynamic-form.component.html',
    styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() id: string = '';
  @Input() key: string = '';
  @Input() formConfig: FormConfig | undefined;
  @Input() form = new FormGroup({})
  @Input() debug = false;
  @Input() asyncUrl: string | null = null;

  @Output() onCustomCallBack = new EventEmitter<CustomButtonCallBackPayload>();
  @Output() onFormSubmit = new EventEmitter<FormGroup>();
  @Output() onFormCancel = new EventEmitter<FormGroup>();
  @Output() onFormReset = new EventEmitter<FormGroup>();
  @Output() onFormConfigLoaded = new EventEmitter<FormConfig>();

  @ViewChild(FormElementHostDirective, {static: true}) formElementHost!: FormElementHostDirective;

  showLoadingIndicator: boolean = false;

  constructor(
    private dynamicFormService: DynamicFormService,
    private performanceMonitor: PerformanceMonitorService
  ) {
    // Subscribe to performance warnings
    this.performanceMonitor.warnings$.subscribe(warning => {
      console.warn(`[Form ${this.id}] Performance Warning:`, warning.message);
    });
  }

  addFormElement(formElement: FormElement) {
    // @ts-ignore
    const componentRef: ComponentRef<DynamicFormElementInterface> = this.formElementHost.viewContainerRef.createComponent<DynamicFormElementInterface>(FormElementMap[formElement.type])
    componentRef.instance.id = this.id + formElement.key
    componentRef.instance.key = formElement.key;
    componentRef.instance.children = formElement.children
    componentRef.instance.form = this.form
    componentRef.instance.config = formElement
    componentRef.instance.debug = this.debug
    this.dynamicFormService.addComponentRef(componentRef)
  }

  /**
   * Renders all form elements and tracks performance
   * @param formConfig - The form configuration containing elements to render
   */
  private renderFormElements(formConfig: FormConfig): void {
    // Count total fields for performance budget check
    const fieldCount = this.countTotalFields(formConfig.elements);

    // Render all elements
    formConfig.elements.forEach(element => {
      this.addFormElement(element);
    });

    // End performance tracking and emit warnings if budgets exceeded
    const renderTime = this.performanceMonitor.endRenderTracking(fieldCount);

    if (this.debug) {
      console.log(`Form rendered with ${fieldCount} fields in ${Math.round(renderTime)}ms`);
    }
  }

  /**
   * Recursively counts all fields in the form configuration
   * @param elements - Array of form elements
   * @returns Total number of fields including nested elements
   */
  private countTotalFields(elements: FormElement[]): number {
    let count = 0;

    for (const element of elements) {
      // Count this element if it's an input type
      if (element.type && this.isInputType(element.type)) {
        count++;
      }

      // Recursively count children
      if (element.children && element.children.length > 0) {
        count += this.countTotalFields(element.children);
      }
    }

    return count;
  }

  /**
   * Checks if an element type is an input type (accepts user input)
   * @param type - The element type string
   * @returns True if the type accepts user input
   */
  private isInputType(type: string): boolean {
    const inputTypes = ['input', 'select', 'checkbox', 'radio-group', 'key-value', 'data-select', 'repeater'];
    return inputTypes.includes(type);
  }


  ngOnInit() {
    if(this.key === '') this.key = this.id;

    // Start performance tracking
    this.performanceMonitor.startRenderTracking();

    if(this.asyncUrl != null) {
      this.dynamicFormService.loadForm(this.asyncUrl).subscribe((formConfig: FormConfig) => {
        this.formConfig = formConfig;
        this.renderFormElements(this.formConfig);
        this.onFormConfigLoaded.emit(this.formConfig);
      })
    } else if (this.formConfig) {
      this.renderFormElements(this.formConfig);
    }
    this.dynamicFormService.elementAdded.subscribe((payload: ElementAddedPayload) => {
      if(payload.targetContainerId === this.key) {
        this.addFormElement(payload.element)
      }
    })
    this.dynamicFormService.onPopulateFormData.subscribe((payload: any) => {
      this.form.patchValue(payload)
    })
    this.dynamicFormService.onShowLoadingIndicator.subscribe(() => {
      this.showLoadingIndicator = true;
    })
    this.dynamicFormService.onHideLoadingIndicator.subscribe(() => {
      this.showLoadingIndicator = false;
    })
  }
  formSubmit(context?: DynamicFormComponent | null) {
    if(!context) {
      context = this;
    }

    // Validate form before submission
    if (context.form.invalid) {
      // Mark all controls as touched to display validation errors
      context.form.markAllAsTouched();

      if (context.debug) {
        console.warn('Form submission blocked: Form is invalid', context.form.errors);
      }
      return;
    }

    context.onFormSubmit.emit(context.form);
  }

  formCancel(context: DynamicFormComponent) {
    context.onFormCancel.emit(context.form);
  }

  formReset(context: DynamicFormComponent) {
    context.onFormReset.emit(context.form);
  }

  buttonClick(button: FormButton) {
    const finalParameters = [this].concat(button.callback.params ?? []);
    if(button.callback) {
      //@ts-ignore
      if (typeof this[button.callback.function] === 'function') {
        if(button.type != 'submit') { //prevent onSubmitFunction from being called twice
          //@ts-ignore
          const fn: Function = this[button.callback.function];
          fn.apply(null, finalParameters);
        }
      } else {
        this.onCustomCallBack.emit({form: this.form, callBack: button.callback});
      }
    }
  }

  /**
   * TrackBy function for button rendering optimization
   * Helps Angular identify unique buttons in the list to minimize DOM updates
   *
   * @param index - The index of the button in the array
   * @param button - The button object
   * @returns The unique identifier for the button (its key)
   */
  trackByButtonKey(index: number, button: FormButton): string {
    return button.key;
  }

  /**
   * TrackBy function for form elements rendering optimization
   * Helps Angular identify unique elements in the list to minimize DOM updates
   *
   * @param index - The index of the element in the array
   * @param element - The form element object
   * @returns The unique identifier for the element (its key)
   */
  trackByElementKey(index: number, element: FormElement): string {
    return element.key;
  }
}
