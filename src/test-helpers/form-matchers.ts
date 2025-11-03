/**
 * Custom Jasmine matchers for form validation testing
 *
 * Usage in test files:
 * ```typescript
 * beforeEach(() => {
 *   jasmine.addMatchers(customFormMatchers);
 * });
 * ```
 */

import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

export interface CustomFormMatchers extends jasmine.CustomMatcherFactories {
  toBeValid(): jasmine.CustomMatcher;
  toBeInvalid(): jasmine.CustomMatcher;
  toHaveError(): jasmine.CustomMatcher;
  toHaveErrors(): jasmine.CustomMatcher;
  toHaveValue(): jasmine.CustomMatcher;
  toBePristine(): jasmine.CustomMatcher;
  toBeDirty(): jasmine.CustomMatcher;
  toBeTouched(): jasmine.CustomMatcher;
  toBeUntouched(): jasmine.CustomMatcher;
  toHaveControl(): jasmine.CustomMatcher;
}

export const customFormMatchers: CustomFormMatchers = {
  /**
   * Checks if a form control is valid
   * @example expect(control).toBeValid()
   */
  toBeValid(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.valid;
        return {
          pass,
          message: pass
            ? `Expected control to be invalid but it was valid`
            : `Expected control to be valid but it was invalid. Errors: ${JSON.stringify(actual.errors)}`
        };
      }
    };
  },

  /**
   * Checks if a form control is invalid
   * @example expect(control).toBeInvalid()
   */
  toBeInvalid(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.invalid;
        return {
          pass,
          message: pass
            ? `Expected control to be valid but it was invalid`
            : `Expected control to be invalid but it was valid`
        };
      }
    };
  },

  /**
   * Checks if a form control has a specific error
   * @example expect(control).toHaveError('required')
   * @example expect(control).toHaveError('minlength', { requiredLength: 8 })
   */
  toHaveError(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl, errorKey: string, expectedValue?: any): jasmine.CustomMatcherResult {
        const hasError = actual.hasError(errorKey);
        const actualError = actual.getError(errorKey);

        if (!hasError) {
          return {
            pass: false,
            message: `Expected control to have error '${errorKey}' but it has errors: ${JSON.stringify(actual.errors)}`
          };
        }

        if (expectedValue !== undefined) {
          const valuesMatch = JSON.stringify(actualError) === JSON.stringify(expectedValue);
          return {
            pass: valuesMatch,
            message: valuesMatch
              ? `Expected control not to have error '${errorKey}' with value ${JSON.stringify(expectedValue)}`
              : `Expected control to have error '${errorKey}' with value ${JSON.stringify(expectedValue)} but got ${JSON.stringify(actualError)}`
          };
        }

        return {
          pass: true,
          message: `Expected control not to have error '${errorKey}'`
        };
      }
    };
  },

  /**
   * Checks if a form control has any errors
   * @example expect(control).toHaveErrors()
   */
  toHaveErrors(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const hasErrors = actual.errors !== null && Object.keys(actual.errors).length > 0;
        return {
          pass: hasErrors,
          message: hasErrors
            ? `Expected control to have no errors but it has: ${JSON.stringify(actual.errors)}`
            : `Expected control to have errors but it has none`
        };
      }
    };
  },

  /**
   * Checks if a form control has a specific value
   * @example expect(control).toHaveValue('test@example.com')
   * @example expect(formGroup).toHaveValue({ name: 'John', email: 'john@example.com' })
   */
  toHaveValue(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl, expectedValue: any): jasmine.CustomMatcherResult {
        const actualValue = actual.value;
        const valuesMatch = JSON.stringify(actualValue) === JSON.stringify(expectedValue);
        return {
          pass: valuesMatch,
          message: valuesMatch
            ? `Expected control not to have value ${JSON.stringify(expectedValue)}`
            : `Expected control to have value ${JSON.stringify(expectedValue)} but got ${JSON.stringify(actualValue)}`
        };
      }
    };
  },

  /**
   * Checks if a form control is pristine (not modified)
   * @example expect(control).toBePristine()
   */
  toBePristine(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.pristine;
        return {
          pass,
          message: pass
            ? `Expected control to be dirty but it was pristine`
            : `Expected control to be pristine but it was dirty`
        };
      }
    };
  },

  /**
   * Checks if a form control is dirty (modified)
   * @example expect(control).toBeDirty()
   */
  toBeDirty(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.dirty;
        return {
          pass,
          message: pass
            ? `Expected control to be pristine but it was dirty`
            : `Expected control to be dirty but it was pristine`
        };
      }
    };
  },

  /**
   * Checks if a form control has been touched
   * @example expect(control).toBeTouched()
   */
  toBeTouched(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.touched;
        return {
          pass,
          message: pass
            ? `Expected control to be untouched but it was touched`
            : `Expected control to be touched but it was untouched`
        };
      }
    };
  },

  /**
   * Checks if a form control is untouched
   * @example expect(control).toBeUntouched()
   */
  toBeUntouched(): jasmine.CustomMatcher {
    return {
      compare(actual: AbstractControl): jasmine.CustomMatcherResult {
        const pass = actual.untouched;
        return {
          pass,
          message: pass
            ? `Expected control to be touched but it was untouched`
            : `Expected control to be untouched but it was touched`
        };
      }
    };
  },

  /**
   * Checks if a FormGroup or FormArray contains a specific control
   * @example expect(formGroup).toHaveControl('email')
   */
  toHaveControl(): jasmine.CustomMatcher {
    return {
      compare(actual: FormGroup | FormArray, controlName: string | number): jasmine.CustomMatcherResult {
        const hasControl = actual.contains(controlName);
        return {
          pass: hasControl,
          message: hasControl
            ? `Expected form not to have control '${controlName}'`
            : `Expected form to have control '${controlName}' but it does not exist. Available controls: ${JSON.stringify(Object.keys(actual.controls))}`
        };
      }
    };
  }
};

/**
 * Type declaration for custom matchers to enable TypeScript support
 */
declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeValid(): boolean;
      toBeInvalid(): boolean;
      toHaveError(errorKey: string, expectedValue?: any): boolean;
      toHaveErrors(): boolean;
      toHaveValue(expectedValue: any): boolean;
      toBePristine(): boolean;
      toBeDirty(): boolean;
      toBeTouched(): boolean;
      toBeUntouched(): boolean;
      toHaveControl(controlName: string | number): boolean;
    }
  }
}
