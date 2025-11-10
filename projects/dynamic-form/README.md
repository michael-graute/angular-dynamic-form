# Angular Dynamic Form Library

A powerful Angular library for building dynamic, data-driven forms from JSON configuration. This library provides a complete solution for creating complex forms with validation, async data loading, and advanced form elements.

## Features

- **JSON-driven forms**: Define your entire form structure in JSON
- **Rich form elements**: Input, select, checkbox, radio, repeater, key-value pairs, and more
- **Advanced layouts**: Rows, cards, tabs, fieldsets, and form groups
- **Async data loading**: Built-in support for loading forms and dropdown options from APIs
- **Comprehensive validation**: Required, min/max length, email, pattern, and custom validators
- **Performance optimized**: Virtual scrolling, caching, and performance monitoring
- **Type-safe**: Full TypeScript support with strong typing
- **Standalone components**: Built with Angular standalone components for modern Angular apps

## Installation

```bash
npm install @angular-dynamic-form/core
# or
yarn add @angular-dynamic-form/core
```

## Quick Start

```typescript
import { Component } from '@angular/core';
import { DynamicFormComponent, FormConfig } from 'dynamic-form';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-my-form',
  imports: [DynamicFormComponent],
  template: `
    <fg-dynamic-form
      [formConfig]="formConfig"
      (onFormSubmit)="handleSubmit($event)">
    </fg-dynamic-form>
  `
})
export class MyFormComponent {
  formConfig: FormConfig = {
    elements: [
      {
        key: 'email',
        label: 'Email',
        type: 'input',
        controlType: 'email',
        validators: [{ name: 'required' }, { name: 'email' }]
      }
    ],
    buttons: [
      {
        key: 'submit',
        type: 'submit',
        label: 'Submit',
        callback: { function: 'formSubmit' }
      }
    ]
  };

  handleSubmit(form: FormGroup) {
    console.log('Form submitted:', form.value);
  }
}
```

## Building

To build the library, run:

```bash
ng build dynamic-form
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/dynamic-form
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
