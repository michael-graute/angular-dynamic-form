import {Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FormElement} from "../dynamic-form.types";
import {DynamicFormElementInterface} from "../dynamic-form-element.interface";

@Component({template: ``})
export abstract class AbstractInputComponent implements DynamicFormElementInterface, OnInit, OnDestroy {
  id: string = '';
  form: FormGroup = new FormGroup({});
  config: FormElement | undefined;
  control: FormControl | undefined;
  hidden = false
  debug = false;

  @HostBinding('class') className = '';

  ngOnInit(): void {
    if(this.config?.class) this.className = this.className + ' ' + this.config?.class

    let validators:ValidatorFn[] = [];
    this.config?.validators?.forEach((validator: any) => {
      switch (validator.name) {
        case 'email':
          validators.push(Validators.email)
          break;
        case 'required':
          validators.push(Validators.required);
          if(this.config) this.config.required = true
          break;
        case 'minLength':
          validators.push(Validators.minLength(validator.value));
          break;
        case 'maxLength':
          validators.push(Validators.maxLength(validator.value));
          break;
      }
    });
    this.control = new FormControl(this.config?.value, validators);
    this.form.addControl(this.id, this.control);
  }

  ngOnDestroy() {
    this.form.removeControl(this.id);
  }
}
