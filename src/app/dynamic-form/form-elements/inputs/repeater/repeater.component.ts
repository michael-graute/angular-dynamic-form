import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {FormArray, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {FormConfig} from "../../../dynamic-form.types";
import {DynamicFormValidators} from "../../../dynamic-form-validators";
import {DataRelationElementComponent} from "../data-relation/data-relation-element/data-relation-element.component";
import {NgForOf, NgIf} from "@angular/common";
import {defaultErrorMessages} from "../../../default-error-messages";

@Component({
  selector: 'fg-repeater',
  imports: [
    ReactiveFormsModule,
    DataRelationElementComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './repeater.component.html',
  styleUrl: './repeater.component.scss'
})
export class RepeaterComponent extends AbstractInputComponent {

  formConfig: FormConfig = {
    elements: [],
    buttons: []
  }

  get formArray(): FormArray<FormGroup> {
    return this.form.get(this.id) as FormArray;
  }

  override ngOnInit() {
    if (this.config?.class) this.className = this.className + ' ' + this.config?.class
    this.formConfig.elements = this.config?.children ?? []
    let validators: ValidatorFn[] = [];
    this.config?.validators?.forEach((validator: any) => {
      //@ts-ignore
      validators.push(DynamicFormValidators[validator.name](validator.value))
      if(validator.errorMessage) {
        this.errorMessages[validator.name] = validator.errorMessage;
      }
    });

    this.form.addControl(this.id, new FormArray([], validators))

    this.config?.value.forEach((value: any) => {
      const formGroup = new FormGroup({})
      this.formArray.push(formGroup)
    })
    setTimeout(() => {
      this.config?.value.forEach((value: any, index: number) => {
        this.formArray.controls.at(index)?.patchValue(value)
      })
    },50)
  }

  override getErrorMessages(): string[] {
    let messages = []
    for (let key in this.formArray?.errors) {
      let message = '';
      if(this.errorMessages.hasOwnProperty(key)) {
        message = this.errorMessages[key];
      } else if(defaultErrorMessages.hasOwnProperty(key)) {
        message = defaultErrorMessages[key];
      } else {
        message = key;
      }
      if(typeof this.formArray?.errors?.[key] === 'object') {
        console.log(this.formArray?.errors?.[key])
        for (let replaceKey in this.formArray?.errors?.[key]) {
          message = message.replace('{' + replaceKey + '}', this.formArray?.errors?.[key][replaceKey]);
        }
      }
      messages.push(message);
    }
    return messages;
  }

  addItem() {
    this.formArray.push(new FormGroup({}))
  }

  removeItem(index: number) {
    this.formArray.removeAt(index)
  }

}
