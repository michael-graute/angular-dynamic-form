import {Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {FormElement} from "../dynamic-form.types";
import {DynamicFormElementInterface} from "../dynamic-form-element.interface";
import {DynamicFormValidators} from "../dynamic-form-validators";

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
      //@ts-ignore
      validators.push(DynamicFormValidators[validator.name](validator.value))
    });
    this.control = new FormControl(this.config?.value, validators);
    this.form.addControl(this.id, this.control);

  }

  ngOnDestroy() {
    this.form.removeControl(this.id);
  }
}
