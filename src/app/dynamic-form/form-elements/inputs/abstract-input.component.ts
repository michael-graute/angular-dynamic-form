import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {FormElement} from "../../dynamic-form.types";
import {DynamicFormElementInterface} from "../../dynamic-form-element.interface";
import {DynamicFormValidators} from "../../dynamic-form-validators";
import {defaultErrorMessages} from "../../default-error-messages";

@Component({template: ``})
export abstract class AbstractInputComponent implements DynamicFormElementInterface, OnInit, OnDestroy {
  id: string = '';
  form: FormGroup = new FormGroup({});
  config: FormElement | undefined;
  control: FormControl | undefined;
  hidden = false
  debug = false;
  @Input() errorMessages: {[key: string]: string} = {};

  @HostBinding('class') className = '';

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

    let validators:ValidatorFn[] = [];
    this.config?.validators?.forEach((validator: any) => {
      //@ts-ignore
      validators.push(DynamicFormValidators[validator.name](validator.value))
      if(validator.errorMessage) {
        this.errorMessages[validator.name] = validator.errorMessage;
      }
    });
    this.control = new FormControl(this.config?.value, validators);
    this.form.addControl(this.id, this.control);
    if(this.config?.onChange) {
      this.control.valueChanges.subscribe((value: string) => {
        console.log(this.id, this.config?.onChange, value)
      })
    }
  }

  ngOnDestroy() {
    this.form.removeControl(this.id);
  }
}
