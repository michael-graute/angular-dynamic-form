# Quickstart Guide: Angular Dynamic Form Generator

**Version**: 1.0.0
**Date**: 2025-10-25
**Target Audience**: Angular developers integrating the dynamic form library

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Common Patterns](#common-patterns)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

---

## Introduction

The Angular Dynamic Form Generator is a component library that lets you create complex, fully-featured forms from JSON configurations. Instead of writing HTML templates and component code for each form, you define the structure declaratively and let the library handle rendering, validation, and data management.

**Key Benefits**:
- Create forms 10x faster than manual HTML/component approach
- Load form structures from APIs (enable server-side form management)
- Consistent validation and error messaging across all forms
- Easily extend with custom field types

**When to Use**:
- Admin panels with many similar CRUD forms
- Survey/questionnaire systems
- Dynamic form builders
- Multi-step wizards
- Data entry applications

---

## Installation

### Prerequisites

- Angular 19.1+ installed
- Node.js 18+ and npm/yarn
- Basic understanding of Angular Reactive Forms

### Step 1: Clone or Install

```bash
# If installing as a library (future NPM package)
npm install @your-org/angular-dynamic-form

# For now, clone the repository
git clone https://github.com/michael-graute/angular-dynamic-form.git
cd angular-dynamic-form
yarn install
```

### Step 2: Import Required Modules

In your component or module, import the DynamicFormComponent:

```typescript
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormConfig } from './dynamic-form/dynamic-form.types';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <fg-dynamic-form
      [formConfig]="formConfig"
      [form]="form"
      (onFormSubmit)="onSubmit($event)">
    </fg-dynamic-form>
  `
})
export class MyFormComponent {
  form = new FormGroup({});
  formConfig: FormConfig = {
    elements: [],
    buttons: []
  };

  onSubmit(form: FormGroup) {
    console.log('Form submitted:', form.value);
  }
}
```

---

## Basic Usage

### Example 1: Simple Contact Form

Create a basic contact form with name, email, and message fields.

```typescript
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormConfig } from './dynamic-form/dynamic-form.types';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <div class="container mt-4">
      <h2>Contact Us</h2>
      <fg-dynamic-form
        [formConfig]="formConfig"
        [form]="form"
        (onFormSubmit)="onSubmit($event)">
      </fg-dynamic-form>
    </div>
  `
})
export class ContactFormComponent {
  form = new FormGroup({});

  formConfig: FormConfig = {
    elements: [
      {
        key: 'name',
        type: 'input',
        controlType: 'text',
        label: 'Your Name',
        required: true,
        settings: { floatingLabel: true }
      },
      {
        key: 'email',
        type: 'input',
        controlType: 'email',
        label: 'Email Address',
        required: true,
        validators: [
          { name: 'required', errorMessage: 'Email is required' },
          { name: 'email', errorMessage: 'Please enter a valid email' }
        ],
        settings: { floatingLabel: true }
      },
      {
        key: 'message',
        type: 'input',
        controlType: 'text',
        label: 'Message',
        required: true,
        validators: [
          { name: 'required' },
          { name: 'minLength', value: 10, errorMessage: 'Message must be at least 10 characters' }
        ],
        settings: { floatingLabel: true }
      }
    ],
    buttons: [
      {
        key: 'submit',
        type: 'submit',
        label: 'Send Message',
        icon: 'bi-send',
        class: 'btn-primary',
        settings: { disableIfFormInvalid: true }
      }
    ]
  };

  onSubmit(form: FormGroup) {
    if (form.valid) {
      console.log('Submitting contact form:', form.value);
      // Send to API
      // this.http.post('/api/contact', form.value).subscribe(...)
    }
  }
}
```

**Result**: A fully functional contact form with validation, disabled submit button when invalid, and floating labels.

---

### Example 2: Loading Form from API

Load the form configuration from a remote endpoint.

```typescript
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormConfig } from './dynamic-form/dynamic-form.types';

@Component({
  selector: 'app-ajax-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <div class="container mt-4">
      <h2>User Registration</h2>
      <fg-dynamic-form
        id="userForm"
        asyncUrl="/api/forms/user-registration"
        (onFormConfigLoaded)="onConfigLoaded($event)"
        (onFormSubmit)="onSubmit($event)">
      </fg-dynamic-form>
    </div>
  `
})
export class AjaxFormComponent {
  onConfigLoaded(config: FormConfig) {
    console.log('Form configuration loaded:', config);
  }

  onSubmit(form: FormGroup) {
    console.log('Form submitted:', form.value);
  }
}
```

**API Response** (`/api/forms/user-registration`):
```json
{
  "elements": [
    {
      "key": "username",
      "type": "input",
      "controlType": "text",
      "label": "Username",
      "required": true,
      "validators": [
        { "name": "minLength", "value": 3 },
        { "name": "maxLength", "value": 20 }
      ]
    },
    {
      "key": "email",
      "type": "input",
      "controlType": "email",
      "label": "Email",
      "required": true,
      "validators": [{ "name": "email" }]
    },
    {
      "key": "password",
      "type": "input",
      "controlType": "password",
      "label": "Password",
      "required": true,
      "validators": [
        { "name": "minLength", "value": 8, "errorMessage": "Password must be at least 8 characters" }
      ]
    }
  ],
  "buttons": [
    {
      "key": "submit",
      "type": "submit",
      "label": "Create Account",
      "class": "btn-success"
    }
  ]
}
```

---

## Common Patterns

### Pattern 1: Dropdown Selection

```typescript
{
  key: 'country',
  type: 'select',
  label: 'Country',
  required: true,
  options: [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ],
  settings: { floatingLabel: true }
}
```

### Pattern 2: Radio Button Group

```typescript
{
  key: 'gender',
  type: 'radio-group',
  label: 'Gender',
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]
}
```

### Pattern 3: Checkbox

```typescript
{
  key: 'terms',
  type: 'checkbox',
  label: 'I agree to the Terms and Conditions',
  required: true,
  validators: [
    { name: 'required', errorMessage: 'You must accept the terms to continue' }
  ]
}
```

### Pattern 4: Nested Form Groups

```typescript
{
  key: 'address',
  type: 'formGroup',
  label: 'Address Information',
  children: [
    {
      key: 'street',
      type: 'input',
      label: 'Street Address'
    },
    {
      key: 'city',
      type: 'input',
      label: 'City'
    },
    {
      key: 'state',
      type: 'select',
      label: 'State',
      options: [
        { value: 'NY', label: 'New York' },
        { value: 'CA', label: 'California' }
      ]
    },
    {
      key: 'zip',
      type: 'input',
      controlType: 'text',
      label: 'ZIP Code',
      validators: [
        { name: 'pattern', value: '^\\d{5}$', errorMessage: 'ZIP must be 5 digits' }
      ]
    }
  ]
}
```

**Form Value Output**:
```javascript
{
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001"
  }
}
```

### Pattern 5: Dynamic Repeater (Add/Remove Items)

```typescript
{
  key: 'phoneNumbers',
  type: 'repeater',
  label: 'Phone Numbers',
  children: [
    {
      key: 'type',
      type: 'select',
      label: 'Type',
      options: [
        { value: 'mobile', label: 'Mobile' },
        { value: 'home', label: 'Home' },
        { value: 'work', label: 'Work' }
      ]
    },
    {
      key: 'number',
      type: 'input',
      controlType: 'tel',
      label: 'Number',
      validators: [
        { name: 'pattern', value: '^\\d{10}$', errorMessage: 'Enter 10-digit phone number' }
      ]
    }
  ],
  validators: [
    { name: 'minItems', value: 1, errorMessage: 'At least one phone number required' },
    { name: 'maxItems', value: 5, errorMessage: 'Maximum 5 phone numbers allowed' }
  ],
  value: [
    { type: 'mobile', number: '' }
  ],
  settings: {
    addButton: {
      label: 'Add Phone',
      icon: 'bi-plus-circle'
    },
    removeButton: {
      icon: 'bi-dash-circle',
      label: ''
    }
  }
}
```

**Form Value Output**:
```javascript
{
  phoneNumbers: [
    { type: 'mobile', number: '5551234567' },
    { type: 'work', number: '5559876543' }
  ]
}
```

---

## Advanced Features

### Feature 1: Async Dropdown Options

Load dropdown options from an API endpoint.

```typescript
{
  key: 'assignedUser',
  type: 'data-select',
  label: 'Assign To',
  settings: {
    floatingLabel: true,
    valueKey: 'id',
    asyncURL: '/api/users'
  }
}
```

**API Response** (`/api/users`):
```json
[
  { "id": 1, "name": "John Doe", "email": "john@example.com" },
  { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
]
```

The dropdown will display "John Doe" and "Jane Smith" as options, submitting the `id` value.

### Feature 2: Tab-Based Layout

Organize long forms into tabs.

```typescript
{
  type: 'tabContainer',
  key: 'tabs',
  children: [
    {
      type: 'tabPane',
      key: 'personal',
      label: 'Personal Info',
      children: [
        { key: 'firstName', type: 'input', label: 'First Name' },
        { key: 'lastName', type: 'input', label: 'Last Name' }
      ]
    },
    {
      type: 'tabPane',
      key: 'contact',
      label: 'Contact Info',
      children: [
        { key: 'email', type: 'input', controlType: 'email', label: 'Email' },
        { key: 'phone', type: 'input', controlType: 'tel', label: 'Phone' }
      ]
    }
  ]
}
```

### Feature 3: Responsive Grid Layout

Use Bootstrap grid for side-by-side fields.

```typescript
{
  type: 'row',
  key: 'nameRow',
  children: [
    {
      type: 'col',
      key: 'firstNameCol',
      class: 'col-md-6',
      children: [
        { key: 'firstName', type: 'input', label: 'First Name' }
      ]
    },
    {
      type: 'col',
      key: 'lastNameCol',
      class: 'col-md-6',
      children: [
        { key: 'lastName', type: 'input', label: 'Last Name' }
      ]
    }
  ]
}
```

### Feature 4: Pre-populating Form Data

Load existing data into the form for editing.

```typescript
import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from './dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-edit-user',
  template: `
    <fg-dynamic-form
      [formConfig]="formConfig"
      [form]="form"
      (onFormSubmit)="onSubmit($event)">
    </fg-dynamic-form>
  `
})
export class EditUserComponent implements OnInit {
  form = new FormGroup({});
  formConfig: FormConfig = { /* ... */ };

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit() {
    // Load user data from API
    this.http.get('/api/users/123').subscribe(userData => {
      this.dynamicFormService.populateFormData(userData);
    });

    // Or load directly via URL
    // this.dynamicFormService.loadFormData('/api/users/123');
  }
}
```

### Feature 5: Custom Button Callbacks

Define custom buttons with application-specific actions.

```typescript
formConfig: FormConfig = {
  elements: [ /* ... */ ],
  buttons: [
    {
      key: 'save-draft',
      type: 'button',
      label: 'Save Draft',
      icon: 'bi-save',
      class: 'btn-secondary',
      callback: {
        function: 'saveDraft',
        params: []
      }
    },
    {
      key: 'submit',
      type: 'submit',
      label: 'Publish',
      class: 'btn-primary'
    }
  ]
};

// In component
onCustomCallBack(payload: CustomButtonCallbackPayload) {
  if (payload.callBack.function === 'saveDraft') {
    console.log('Saving draft:', payload.form.value);
    this.http.post('/api/drafts', payload.form.value).subscribe(...);
  }
}
```

Template:
```html
<fg-dynamic-form
  [formConfig]="formConfig"
  [form]="form"
  (onFormSubmit)="onSubmit($event)"
  (onCustomCallBack)="onCustomCallBack($event)">
</fg-dynamic-form>
```

---

## Troubleshooting

### Issue 1: Validation Not Working

**Symptom**: Validators defined in JSON don't trigger errors.

**Solutions**:
1. Ensure validator names are spelled correctly (case-sensitive)
2. For validators requiring values (minLength, pattern, etc.), verify `value` is provided
3. Check that field has been touched (validation displays after blur)
4. Verify FormControl is properly created for the element

```typescript
// Correct
{ name: 'minLength', value: 5 }

// Incorrect (missing value)
{ name: 'minLength' }
```

### Issue 2: Form Value Structure Wrong

**Symptom**: Form value doesn't match expected nested structure.

**Solutions**:
1. Use `formGroup` type for nested objects (not just containers like `card`)
2. Verify unique `key` values for all elements
3. Check that repeater elements have `children` defined

```typescript
// Creates nested object
{ type: 'formGroup', key: 'address', children: [...] }

// Does NOT create nested object (just visual grouping)
{ type: 'card', key: 'addressCard', children: [...] }
```

### Issue 3: Async Form Config Not Loading

**Symptom**: Form doesn't render when using `asyncUrl`.

**Solutions**:
1. Check browser console for HTTP errors
2. Verify API endpoint returns valid FormConfig JSON
3. Ensure CORS headers are set if API is on different domain
4. Add error handling with `(onFormConfigLoaded)` event

```typescript
<fg-dynamic-form
  asyncUrl="/api/forms/user-form"
  (onFormConfigLoaded)="onConfigLoaded($event)">
</fg-dynamic-form>

onConfigLoaded(config: FormConfig) {
  console.log('Config loaded successfully:', config);
}
```

### Issue 4: Performance Degradation with Large Forms

**Symptom**: Form is slow to render or interact with.

**Solutions**:
1. Limit repeater items to under 100
2. Use virtual scrolling for large dropdown options
3. Reduce nesting depth (keep under 3 levels)
4. Avoid excessive validators per field (< 10)

---

## Next Steps

- **Extend with Custom Components**: Create your own form element types
- **Add Custom Validators**: Implement application-specific validation rules
- **Integrate with State Management**: Use NgRx or signals for form state
- **Build Form Designer UI**: Create visual editor for generating JSON configs

For more information, see:
- [data-model.md](data-model.md) - Complete entity documentation
- [research.md](research.md) - Architecture decisions and best practices
- [Examples](/src/app/examples/) - Working code examples in the repository
