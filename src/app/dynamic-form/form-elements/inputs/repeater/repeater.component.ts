import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {FormArray, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {FormConfig} from "../../../dynamic-form.types";
import {DynamicFormValidators} from "../../../dynamic-form-validators";
import {DataRelationElementComponent} from "../data-relation/data-relation-element/data-relation-element.component";
import {NgForOf, NgIf} from "@angular/common";


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

  override get formArray(): FormArray<FormGroup> {
    return this.form.get(this.key) as FormArray;
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
    this.control = new FormArray([], validators);
    this.form.addControl(this.key, this.control);

    if(this.config?.value) {
      this.config?.value.forEach(() => {
        const formGroup = new FormGroup({})
        this.formArray.push(formGroup)
      })
      setTimeout(() => {
        this.config?.value.forEach((value: any, index: number) => {
          this.formArray.controls.at(index)?.patchValue(value)
        })
      },50)
    }
  }

  override addItem() {
    this.formArray.push(new FormGroup({}))
  }

}
