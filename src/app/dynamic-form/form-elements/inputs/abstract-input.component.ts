import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {FormElement} from "../../dynamic-form.types";
import {DynamicFormElementInterface} from "../../dynamic-form-element.interface";
import {DynamicFormValidators} from "../../dynamic-form-validators";
import {defaultErrorMessages} from "../../default-error-messages";

@Component({template: ``})
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

  ngOnDestroy() {
    this.form.removeControl(this.key);
  }

  addItem() {
    this.formArray.push(new FormControl('', this.validators))
  }

  removeItem(index: number) {
    this.formArray.removeAt(index)
  }
}
