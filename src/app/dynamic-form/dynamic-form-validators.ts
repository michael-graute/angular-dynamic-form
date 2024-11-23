import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

export class DynamicFormValidators {

  static minItems(minItems: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length < minItems || control.value === null) ? {minItems: {param: minItems, value: control.value?.length || 0}} : null;
    };
  }

  static maxItems(maxItems: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length > maxItems) ? {maxItems: {param: maxItems, value: control.value?.length || 0}} : null;
    };
  }

  static inArray(allowedValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedValues.includes(control.value) ? null : {inArray: {param: allowedValues.join(', '), value: control.value, allowedValues: allowedValues}};
    }
  }

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length < minLength || control.value === null) ? {minLength: {param: minLength,value: control.value?.length || 0}} : null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length > maxLength) ? {maxLength: {param: maxLength, value: control.value?.length}} : null;
    };
  }

  static required(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value && Array.isArray(control.value)) {
        return (control.value.length === 0) ? {required: true} : null;
      }
      return (!control.value || control.value === 'null') ? {required: true} : null;
    }
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.email(control);
    }
  }

  static pattern(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.pattern(pattern);
    }
  }

}
