/**
 * Type guards for form-related types
 * Provides runtime type checking with TypeScript type narrowing support
 */

import { FormElement, FormButton, ElementValidator, FormConfig } from '../dynamic-form.types';

/**
 * Type guard to check if a value is a FormElement
 *
 * @param value - The value to check
 * @returns True if value is a FormElement
 */
export function isFormElement(value: unknown): value is FormElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    typeof (value as FormElement).key === 'string'
  );
}

/**
 * Type guard to check if a FormElement has children
 *
 * @param element - The form element to check
 * @returns True if element has children array
 */
export function hasChildren(element: FormElement): element is FormElement & { children: FormElement[] } {
  return (
    Array.isArray(element.children) &&
    element.children.length > 0
  );
}

/**
 * Type guard to check if a FormElement has validators
 *
 * @param element - The form element to check
 * @returns True if element has validators array
 */
export function hasValidators(element: FormElement): element is FormElement & { validators: ElementValidator[] } {
  return (
    Array.isArray(element.validators) &&
    element.validators.length > 0
  );
}

/**
 * Type guard to check if a FormElement has options (select, radio, checkbox)
 *
 * @param element - The form element to check
 * @returns True if element has options array
 */
export function hasOptions(element: FormElement): element is FormElement & { options: Array<{ value?: string; label?: string }> } {
  return (
    Array.isArray(element.options) &&
    element.options.length > 0
  );
}

/**
 * Type guard to check if a FormElement supports multiple values (FormArray)
 *
 * @param element - The form element to check
 * @returns True if element is configured for multiple values
 */
export function isMultipleValueElement(element: FormElement): element is FormElement & { multiple: true } {
  return element.multiple === true;
}

/**
 * Type guard to check if a value is a FormButton
 *
 * @param value - The value to check
 * @returns True if value is a FormButton
 */
export function isFormButton(value: unknown): value is FormButton {
  return (
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    'type' in value &&
    typeof (value as FormButton).key === 'string' &&
    ['submit', 'reset', 'button'].includes((value as FormButton).type)
  );
}

/**
 * Type guard to check if a value is an ElementValidator
 *
 * @param value - The value to check
 * @returns True if value is an ElementValidator
 */
export function isElementValidator(value: unknown): value is ElementValidator {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as ElementValidator).name === 'string'
  );
}

/**
 * Type guard to check if a value is a FormConfig
 *
 * @param value - The value to check
 * @returns True if value is a FormConfig
 */
export function isFormConfig(value: unknown): value is FormConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'elements' in value &&
    'buttons' in value &&
    Array.isArray((value as FormConfig).elements) &&
    Array.isArray((value as FormConfig).buttons)
  );
}

/**
 * Type guard to check if a FormElement is a container type (has children)
 * Container types: fieldset, card, formGroup, row, col, tabContainer, tabPane, repeater, data-relation
 *
 * @param element - The form element to check
 * @returns True if element is a container type
 */
export function isContainerElement(element: FormElement): boolean {
  const containerTypes = [
    'fieldset',
    'card',
    'formGroup',
    'row',
    'col',
    'tabContainer',
    'tabPane',
    'repeater',
    'data-relation'
  ];

  return (
    element.type !== undefined &&
    containerTypes.includes(element.type)
  );
}

/**
 * Type guard to check if a FormElement is an input type (accepts user input)
 * Input types: input, select, checkbox, radio-group, key-value, data-select
 *
 * @param element - The form element to check
 * @returns True if element is an input type
 */
export function isInputElement(element: FormElement): boolean {
  const inputTypes = [
    'input',
    'select',
    'checkbox',
    'radio-group',
    'key-value',
    'data-select'
  ];

  return (
    element.type !== undefined &&
    inputTypes.includes(element.type)
  );
}

/**
 * Type guard to check if a FormElement has async data loading (asyncURL property)
 *
 * @param element - The form element to check
 * @returns True if element has asyncURL defined in settings
 */
export function hasAsyncUrl(element: FormElement): boolean {
  return (
    element.settings !== undefined &&
    typeof element.settings === 'object' &&
    'asyncURL' in element.settings &&
    typeof element.settings.asyncURL === 'string'
  );
}

/**
 * Type guard to check if a FormButton has a callback function
 *
 * @param button - The form button to check
 * @returns True if button has callback configuration
 */
export function hasCallback(button: FormButton): button is FormButton & { callback: { function: string } } {
  return (
    button.callback !== undefined &&
    typeof button.callback === 'object' &&
    'function' in button.callback &&
    typeof button.callback.function === 'string'
  );
}
