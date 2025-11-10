import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

export class DynamicFormValidators {

  static minItems(minItems: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length < minItems || control.value === null) ? {minItems: {expected: minItems, given: control.value?.length || 0}} : null;
    };
  }

  static maxItems(maxItems: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length > maxItems) ? {maxItems: {expected: maxItems, given: control.value?.length || 0}} : null;
    };
  }

  static inArray(allowedValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedValues.includes(control.value) ? null : {inArray: {expected: allowedValues.join(', '), given: control.value}};
    }
  }

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length < minLength || control.value === null) ? {minLength: {expected: minLength,given: control.value?.length || 0}} : null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value?.length > maxLength) ? {maxLength: {expected: maxLength, given: control.value?.length}} : null;
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

  static pattern(pattern: string | RegExp): ValidatorFn {
    let regex: RegExp;
    if(typeof pattern === 'string') {
      regex = new RegExp(pattern);
    } else {
      regex = pattern;
    }
    return (control: AbstractControl): ValidationErrors | null => {
     return (regex.test(control.value) ? null : {pattern: {expected: regex.toString(), given: control.value}})
    }
  }

}
