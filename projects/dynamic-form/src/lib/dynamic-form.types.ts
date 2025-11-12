export type FormElement = {
  key: string;
  value?: any;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  validators?: ElementValidator[];
  order?: number;
  controlType?: 'text' | 'number' | 'email' | 'password' | 'date' | 'datetime-local' | 'time' | 'week' | 'search' | 'tel' | 'url';
  type?: string;
  options?: { value?: string; label?: string }[];
  class?: string;
  settings?: any;
  errorMessages?: any[],
  helpText?: string;
  children?: FormElement[];
  onChange?: any
  multiple?: boolean;
  multipleLabel?: string;
}

export type ElementValidator = {
  name: string;
  value?: any;
  errorMessage?: string;
  async?: boolean;  // Whether this is an async validator
  asyncUrl?: string;  // URL endpoint for async validation
  asyncTrigger?: 'blur' | 'debounce';  // When to trigger async validation
  asyncDebounceTime?: number;  // Debounce time in ms (default: 500)
}

export type FormButtonCallback = {
  function: string;
  params?: any[];
}

export type FormButton = {
  key: string;
  type: 'submit' | 'reset' | 'button';
  callback: FormButtonCallback;
  class?: string;
  label?: string;
  icon?: string;
  settings?: any;
}

export type FormConfig = {
  elements: FormElement[],
  buttons: FormButton[],
  submitCallback?: string;
  settings?: any;
}
