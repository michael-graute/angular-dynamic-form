export type FormElement = {
  value?: any;
  key: string;
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
}

export type ElementValidator = {
  name: string;
  value?: any;
  errorMessage?: string
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
