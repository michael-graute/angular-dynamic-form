import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Observable, of, timer} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";

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

  static minNumber(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value < min) ? {minNumber: {expected: min, given: control.value}} : null;
    };
  }

  static maxNumber(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value > max) ? {maxNumber: {expected: max, given: control.value}} : null;
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

  /**
   * Creates an async validator that sends the value to a backend endpoint for validation
   * @param http - HttpClient instance for making HTTP requests
   * @param url - Backend endpoint URL for validation
   * @param debounceTime - Debounce time in milliseconds (default: 500ms)
   * @returns AsyncValidatorFn that validates against backend
   *
   * Expected backend response format:
   * - Success: { valid: true }
   * - Failure: { valid: false, error: "Error message" }
   */
  static asyncBackend(http: HttpClient, url: string, debounceTime: number = 500): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Don't validate empty values
      if (!control.value) {
        return of(null);
      }

      // Debounce the validation request
      return timer(debounceTime).pipe(
        switchMap(() => {
          // Send the value to the backend for validation
          return http.post<{ valid: boolean; error?: string }>(url, {
            value: control.value
          }).pipe(
            map(response => {
              // If valid=true, return null (no error)
              if (response.valid) {
                return null;
              }
              // If valid=false, return error object
              return {
                asyncBackend: {
                  message: response.error || 'Validation failed',
                  value: control.value
                }
              };
            }),
            catchError((error) => {
              // On HTTP error, return validation error
              console.error('Async validation error:', error);
              return of({
                asyncBackend: {
                  message: 'Validation request failed. Please try again.',
                  value: control.value
                }
              });
            })
          );
        })
      );
    };
  }

}
