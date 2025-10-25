/**
 * TypeScript Interface Contracts for Angular Dynamic Form Generator
 *
 * This file defines the complete type system for JSON form configurations.
 * These interfaces serve as the contract between JSON configurations and
 * the TypeScript implementation.
 *
 * @version 1.0.0
 * @date 2025-10-25
 */

// ============================================================================
// Validator Types
// ============================================================================

/**
 * Supported validator names
 */
export type ValidatorName =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minItems'
  | 'maxItems'
  | 'inArray';

/**
 * Validation rule configuration
 */
export interface ElementValidator {
  /** Validator identifier */
  name: ValidatorName;

  /** Validator parameter (e.g., minLength value, pattern regex string) */
  value?: any;

  /** Custom error message override */
  errorMessage?: string;
}

// ============================================================================
// Option Types
// ============================================================================

/**
 * Selectable option for select, radio-group, or checkbox elements
 */
export interface Option {
  /** Value submitted with form */
  value: any;

  /** Display text shown to user */
  label: string;
}

// ============================================================================
// Button Types
// ============================================================================

/**
 * Button type enumeration
 */
export type ButtonType = 'submit' | 'reset' | 'cancel' | 'button';

/**
 * Button callback configuration
 */
export interface ButtonCallback {
  /** Name of function to call */
  function: string;

  /** Parameters to pass to function */
  params?: any[];
}

/**
 * Button behavior settings
 */
export interface ButtonSettings {
  /** Disable button when form is invalid */
  disableIfFormInvalid?: boolean;
}

/**
 * Form action button configuration
 */
export interface FormButton {
  /** Unique button identifier */
  key: string;

  /** Button type */
  type: ButtonType;

  /** Button display text */
  label: string;

  /** Icon class (e.g., 'bi-check-circle' for Bootstrap Icons) */
  icon?: string;

  /** CSS classes to apply to button */
  class?: string;

  /** Button behavior settings */
  settings?: ButtonSettings;

  /** Function callback configuration */
  callback?: ButtonCallback;
}

// ============================================================================
// Form Element Types
// ============================================================================

/**
 * Component type categories
 */
export type InputComponentType =
  | 'input'
  | 'select'
  | 'checkbox'
  | 'radio-group'
  | 'repeater'
  | 'key-value'
  | 'data-relation'
  | 'data-select';

export type ContainerComponentType =
  | 'card'
  | 'fieldset'
  | 'formGroup'
  | 'row'
  | 'col'
  | 'tabContainer'
  | 'tabPane';

export type DisplayComponentType = 'form-text';

/**
 * All supported component types
 */
export type ComponentType =
  | InputComponentType
  | ContainerComponentType
  | DisplayComponentType;

/**
 * HTML5 input types for input elements
 */
export type InputControlType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'week'
  | 'month'
  | 'url'
  | 'tel'
  | 'search';

/**
 * Recursive form element configuration
 */
export interface FormElement {
  /** Unique identifier for the element within parent scope (REQUIRED) */
  key: string;

  /** Component type identifier (REQUIRED) */
  type: ComponentType;

  /** Display label for the element */
  label?: string;

  /** Use Bootstrap floating label style */
  floatingLabel?: boolean;

  /** Helper text displayed below field */
  helpText?: string;

  /** Initial/default value */
  value?: any;

  /** Shorthand for required validator */
  required?: boolean;

  /** Array of validation rules */
  validators?: ElementValidator[];

  /** Custom error message overrides (key = validator name) */
  errorMessages?: Record<string, string>;

  /** Callback function name for value changes */
  onChange?: string;

  /** Options for select/radio/checkbox elements */
  options?: Option[];

  /** Enable multiple values (creates FormArray) */
  multiple?: boolean;

  /** Label for multiple value group */
  multipleLabel?: string;

  /** HTML5 input type (for input elements only) */
  controlType?: InputControlType;

  /** Component-specific settings */
  settings?: Record<string, any>;

  /** Nested child elements (for container types) */
  children?: FormElement[];

  /** CSS classes to apply to element */
  class?: string;

  /** Display order (optional, defaults to array index) */
  order?: number;
}

// ============================================================================
// Form Configuration
// ============================================================================

/**
 * Root form configuration object
 */
export interface FormConfig {
  /** Array of form elements (inputs, containers, displays) */
  elements: FormElement[];

  /** Array of action buttons (optional) */
  buttons?: FormButton[];

  /** Global form settings (optional) */
  settings?: Record<string, any>;

  /** Name of function to call on submit (optional) */
  submitCallback?: string;
}

// ============================================================================
// Runtime State Types
// ============================================================================

/**
 * Loading state for async operations
 */
export interface LoadingState<T> {
  /** Is data currently loading */
  loading: boolean;

  /** Loaded data (null if not loaded or error occurred) */
  data: T | null;

  /** Error that occurred during loading (null if no error) */
  error: Error | null;
}

/**
 * Cache entry for async data
 */
export interface CacheEntry<T> {
  /** Cached data */
  data: T;

  /** Timestamp when data was cached */
  timestamp: number;
}

/**
 * Custom button callback event payload
 */
export interface CustomButtonCallbackPayload {
  /** The FormGroup instance */
  form: any; // FormGroup from @angular/forms

  /** The callback configuration */
  callBack: ButtonCallback;
}

/**
 * Element added event payload
 */
export interface ElementAddedPayload {
  /** The added element configuration */
  element: FormElement;

  /** ID of target parent element */
  targetId: string;
}

/**
 * Element removed event payload
 */
export interface ElementRemovedPayload {
  /** ID of removed element */
  elementId: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if object is a FormElement
 */
export function isFormElement(obj: any): obj is FormElement {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.key === 'string' &&
    typeof obj.type === 'string'
  );
}

/**
 * Type guard to check if FormElement has children
 */
export function hasChildren(
  element: FormElement
): element is FormElement & { children: FormElement[] } {
  return Array.isArray(element.children) && element.children.length > 0;
}

/**
 * Type guard to check if FormElement is an input component
 */
export function isInputComponent(element: FormElement): boolean {
  const inputTypes: InputComponentType[] = [
    'input',
    'select',
    'checkbox',
    'radio-group',
    'repeater',
    'key-value',
    'data-relation',
    'data-select',
  ];
  return inputTypes.includes(element.type as InputComponentType);
}

/**
 * Type guard to check if FormElement is a container component
 */
export function isContainerComponent(element: FormElement): boolean {
  const containerTypes: ContainerComponentType[] = [
    'card',
    'fieldset',
    'formGroup',
    'row',
    'col',
    'tabContainer',
    'tabPane',
  ];
  return containerTypes.includes(element.type as ContainerComponentType);
}

/**
 * Type guard to check if FormElement requires options
 */
export function requiresOptions(element: FormElement): boolean {
  return ['select', 'radio-group', 'checkbox'].includes(element.type);
}

/**
 * Type guard to check if validator requires a value parameter
 */
export function validatorRequiresValue(name: ValidatorName): boolean {
  return [
    'minLength',
    'maxLength',
    'pattern',
    'minItems',
    'maxItems',
    'inArray',
  ].includes(name);
}

// ============================================================================
// Validation Helper Types
// ============================================================================

/**
 * Validation error structure
 */
export interface ValidationError {
  /** Validator name that failed */
  validator: ValidatorName;

  /** Expected value (e.g., minLength: 8) */
  expected: any;

  /** Actual value that failed */
  actual: any;

  /** Error message */
  message: string;
}

/**
 * Form validation result
 */
export interface FormValidationResult {
  /** Is form valid */
  valid: boolean;

  /** Errors by element key */
  errors: Record<string, ValidationError[]>;
}
