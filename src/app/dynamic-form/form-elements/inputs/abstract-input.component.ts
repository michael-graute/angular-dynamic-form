import {Component, HostBinding, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FormElement} from "../../dynamic-form.types";
import {DynamicFormElementInterface} from "../../dynamic-form-element.interface";
import {DynamicFormValidators} from "../../dynamic-form-validators";
import {defaultErrorMessages} from "../../default-error-messages";
import {DynamicFormService} from "../../dynamic-form.service";
import {Subscription} from "rxjs";

@Component({
  template: ``,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export abstract class AbstractInputComponent implements DynamicFormElementInterface, OnInit, OnDestroy {
  id: string = '';
  key: string = '';
  form: FormGroup = new FormGroup({});
  config: FormElement | undefined;
  control: FormControl | FormArray<never> | undefined;
  hidden = false
  debug = false;
  validators: ValidatorFn[] = []
  @Input() errorMessages: {[key: string]: string} = {};

  protected dynamicFormService = inject(DynamicFormService);
  protected populateDataSubscription?: Subscription;

  @HostBinding('class') className = '';

  get formArray(): FormArray {
    return this.form.get(this.key) as FormArray;
  }

  getErrorMessages(): string[] {
    let messages = []
    for (let key in this.control?.errors) {
      let message = '';
      if(this.errorMessages.hasOwnProperty(key)) {
        message = this.errorMessages[key];
      } else if(defaultErrorMessages.hasOwnProperty(key)) {
        message = defaultErrorMessages[key];
      } else {
        message = key;
      }
      if(typeof this.control?.errors?.[key] === 'object') {
        for (let replaceKey in this.control?.errors?.[key]) {
          message = message.replace('{' + replaceKey + '}', this.control?.errors?.[key][replaceKey]);
        }
        // Support {actual} as alias for {given}
        if(this.control?.errors?.[key].hasOwnProperty('given')) {
          message = message.replace('{actual}', this.control?.errors?.[key]['given']);
        }
      }
      messages.push(message);
    }
    return messages;
  }

  getMultipleErrorMessages(foo: any): any[] {
    let messages = []
    for (let key in foo?.errors) {
      let message = '';
      if(this.errorMessages.hasOwnProperty(key)) {
        message = this.errorMessages[key];
      } else if(defaultErrorMessages.hasOwnProperty(key)) {
        message = defaultErrorMessages[key];
      } else {
        message = key;
      }
      if(typeof foo.errors?.[key] === 'object') {
        for (let replaceKey in foo.errors?.[key]) {
          message = message.replace('{' + replaceKey + '}', foo.errors?.[key][replaceKey]);
        }
        // Support {actual} as alias for {given}
        if(foo.errors?.[key].hasOwnProperty('given')) {
          message = message.replace('{actual}', foo.errors?.[key]['given']);
        }
      }
      messages.push(message);
    }
    return messages;
  }

  ngOnInit(): void {
    if(this.config?.class) this.className = this.className + ' ' + this.config?.class

    this.config?.validators?.forEach((validator: any) => {
      //@ts-ignore
      this.validators.push(DynamicFormValidators[validator.name](validator.value))
      if(validator.errorMessage) {
        this.errorMessages[validator.name] = validator.errorMessage;
      }
    });

    if(this.config?.multiple) {
      if(this.config?.type != 'input' && this.config?.type != 'select') {
        throw new Error('The "multiple" config parameter is only suitable for the primitive types "input" and "select"')
      }
      this.control = new FormArray([]);
      this.form.addControl(this.key, this.control);
      if(this.config?.value) {
        this.config?.value.forEach((value: any) => {
          this.formArray.push(new FormControl(value, this.validators));
        })
      }

      // Subscribe to dynamic data population for multiple inputs
      this.populateDataSubscription = this.dynamicFormService.onPopulateFormData.subscribe((data: any) => {
        if (data && data[this.key] && Array.isArray(data[this.key])) {
          this.populateMultipleData(data[this.key]);
        }
      });
    } else {
      this.control = new FormControl(this.config?.value, this.validators);
      this.form.addControl(this.key, this.control);
      if(this.config?.onChange) {
        this.control.valueChanges.subscribe((value: string) => {
          console.log(this.key, this.config?.onChange, value)
        })
      }
    }
  }

  /**
   * Populates multiple input data (FormArray of FormControls), adjusting array size as needed
   * @param data - Array of values to populate
   */
  protected populateMultipleData(data: any[]): void {
    const currentLength = this.formArray.length;
    const targetLength = data.length;

    // Add or remove FormControls to match the data length
    if (targetLength > currentLength) {
      // Add missing FormControls
      for (let i = currentLength; i < targetLength; i++) {
        this.formArray.push(new FormControl(null, this.validators));
      }
    } else if (targetLength < currentLength) {
      // Remove extra FormControls
      for (let i = currentLength - 1; i >= targetLength; i--) {
        this.formArray.removeAt(i);
      }
    }

    // Populate the values
    data.forEach((value: any, index: number) => {
      this.formArray.at(index)?.setValue(value);
    });
  }

  ngOnDestroy() {
    this.form.removeControl(this.key);
    if (this.populateDataSubscription) {
      this.populateDataSubscription.unsubscribe();
    }
  }

  addItem() {
    this.formArray.push(new FormControl(null, this.validators))
  }

  removeItem(index: number) {
    this.formArray.removeAt(index)
  }
}
