import {Component, forwardRef, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'fg-key-value-element',
    imports: [
        NgForOf,
        FormsModule
    ],
    templateUrl: './key-value-element.component.html',
    styleUrl: './key-value-element.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => KeyValueElementComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: forwardRef(() => KeyValueElementComponent)
        }
    ]
})
export class KeyValueElementComponent implements ControlValueAccessor, Validator {

  @Input() settings: any = {}

  value: any[] = [];

  onChange = (value: any) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onTouched = () => {};

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValidatorChanged = () => {};

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChanged = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  writeValue(obj: any): void {
    this.value = obj
  }

  addRow(): void {
    let newValueRow: any = {}
    this.settings.colDefs.forEach((colDef: any) => {
      newValueRow[colDef.varName] = null;
    })
    this.value.push(
      newValueRow
    )
  }

  removeRow(index: number): void {
    this.value.splice(index, 1)
  }

}
