import { Component, OnDestroy } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {FormArray, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {FormConfig} from "../../../dynamic-form.types";
import {DynamicFormValidators} from "../../../dynamic-form-validators";
import {DataRelationElementComponent} from "../data-relation/data-relation-element/data-relation-element.component";



@Component({
  selector: 'fg-repeater',
  imports: [
    ReactiveFormsModule,
    DataRelationElementComponent
],
  templateUrl: './repeater.component.html',
  styleUrl: './repeater.component.scss'
})
export class RepeaterComponent extends AbstractInputComponent implements OnDestroy {

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

    // Subscribe to dynamic data population events
    this.populateDataSubscription = this.dynamicFormService.onPopulateFormData.subscribe((data: any) => {
      if (data && data[this.key] && Array.isArray(data[this.key])) {
        this.populateArrayData(data[this.key]);
      }
    });
  }

  /**
   * Populates the FormArray with data, adjusting the array size as needed
   * @param data - Array of data to populate
   */
  private populateArrayData(data: any[]): void {
    const currentLength = this.formArray.length;
    const targetLength = data.length;

    // Add or remove FormGroups to match the data length
    if (targetLength > currentLength) {
      // Add missing FormGroups
      for (let i = currentLength; i < targetLength; i++) {
        this.formArray.push(new FormGroup({}));
      }
    } else if (targetLength < currentLength) {
      // Remove extra FormGroups
      for (let i = currentLength - 1; i >= targetLength; i--) {
        this.formArray.removeAt(i);
      }
    }

    // Populate the data after a brief delay to ensure child components are initialized
    setTimeout(() => {
      data.forEach((value: any, index: number) => {
        this.formArray.at(index)?.patchValue(value);
      });
    }, 50);
  }

  override addItem() {
    this.formArray.push(new FormGroup({}))
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
