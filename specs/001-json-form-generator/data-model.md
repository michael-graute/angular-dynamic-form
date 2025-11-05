# Data Model: Angular Dynamic Form Generator

**Feature**: JSON-Based Dynamic Form Generator
**Date**: 2025-10-25
**Purpose**: Define the core data entities, their relationships, validation rules, and state transitions

## Overview

The Angular Dynamic Form Generator uses a declarative data model where forms are defined as JSON-serializable objects. The model consists of three primary entity types: **FormConfig** (root), **FormElement** (recursive component), and **FormButton** (action trigger).

## Entity Diagram

```
FormConfig
├── elements: FormElement[]
├── buttons: FormButton[]
└── settings: Record<string, any>

FormElement (recursive)
├── key: string
├── type: string
├── label?: string
├── value?: any
├── validators?: ElementValidator[]
├── options?: Option[]
├── children?: FormElement[]
└── settings?: Record<string, any>

FormButton
├── key: string
├── type: 'submit' | 'reset' | 'cancel' | 'button'
├── label: string
├── callback?: ButtonCallback
└── settings?: ButtonSettings

ElementValidator
├── name: ValidatorName
├── value?: any
└── errorMessage?: string
```

## Core Entities

### 1. FormConfig

The root configuration object representing a complete form.

**Fields**:
- `elements: FormElement[]` - Array of form elements (inputs, containers, displays)
- `buttons?: FormButton[]` - Array of action buttons (optional, defaults to no buttons)
- `settings?: Record<string, any>` - Global form settings (optional)
- `submitCallback?: string` - Name of function to call on submit (optional)

**Relationships**:
- Has many FormElement (one-to-many)
- Has many FormButton (one-to-many, optional)

**Validation Rules**:
- MUST have at least one element in `elements` array
- `elements` array MUST NOT be null or undefined
- Button `type` values MUST be one of: 'submit', 'reset', 'cancel', 'button'
- If `submitCallback` specified, MUST be a valid JavaScript identifier

**State Transitions**:
1. **Unloaded** → **Loading** (when async URL provided)
2. **Loading** → **Loaded** (when config successfully fetched)
3. **Loading** → **Error** (when fetch fails)
4. **Loaded** → **Rendered** (when components instantiated)
5. **Rendered** → **Dirty** (when user modifies any field)
6. **Dirty** → **Submitting** (when submit triggered)
7. **Submitting** → **Submitted** (when submission completes)

**Example**:
```json
{
  "elements": [
    { "type": "input", "key": "email", "label": "Email", "controlType": "email" }
  ],
  "buttons": [
    { "key": "submit", "type": "submit", "label": "Submit", "class": "btn-primary" }
  ]
}
```

---

### 2. FormElement

Represents a single form component (input, container, or display element). This entity is recursive - container elements have `children` arrays containing nested FormElement objects.

**Fields**:
- `key: string` - Unique identifier for the element within its parent scope (REQUIRED)
- `type: string` - Component type identifier (REQUIRED, maps to component registry)
- `label?: string` - Display label for the element
- `floatingLabel?: boolean` - Use Bootstrap floating label style
- `helpText?: string` - Helper text displayed below field
- `value?: any` - Initial/default value
- `required?: boolean` - Shorthand for required validator
- `validators?: ElementValidator[]` - Array of validation rules
- `errorMessages?: Record<string, string>` - Custom error message overrides
- `onChange?: string` - Callback function name for value changes
- `options?: Option[]` - Options for select/radio/checkbox elements
- `multiple?: boolean` - Enable multiple values (FormArray mode)
- `multipleLabel?: string` - Label for multiple value group
- `controlType?: string` - HTML5 input type (for input elements)
- `settings?: Record<string, any>` - Component-specific settings
- `children?: FormElement[]` - Nested child elements (for containers)
- `class?: string` - CSS classes to apply
- `order?: number` - Display order (optional, defaults to array index)

**Relationships**:
- Belongs to FormConfig or parent FormElement
- Has many FormElement children (recursive, for container types)
- Has many ElementValidator (one-to-many)
- Has many Option (one-to-many, for select/radio/checkbox types)

**Validation Rules**:
- `key` MUST be unique within parent scope (siblings cannot share keys)
- `key` MUST match pattern `^[a-zA-Z][a-zA-Z0-9_-]*$` (valid JavaScript identifier)
- `type` MUST map to registered component in form-elements.map.ts
- If `children` present, `type` MUST be a container type (card, fieldset, formGroup, row, col, tabContainer, tabPane, repeater)
- If `options` present, `type` MUST be select, radio-group, or checkbox
- If `controlType` present, `type` MUST be 'input'
- `controlType` MUST be valid HTML5 input type if specified
- If `multiple: true`, `type` MUST be 'input' or 'select'
- Circular references in `children` are FORBIDDEN (tree structure only)

**State Transitions**:
1. **Uninitialized** → **Initialized** (when FormControl/FormGroup created)
2. **Initialized** → **Pristine** (initial state, untouched)
3. **Pristine** → **Dirty** (when user modifies value)
4. **Valid** ↔ **Invalid** (based on validator results)
5. **Untouched** → **Touched** (when user focuses then blurs field)

**Component Type Categories**:

**Input Types** (form controls):
- `input` - Text input with configurable controlType
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox or checkbox group
- `radio-group` - Mutually exclusive radio buttons
- `repeater` - Dynamic array of field groups
- `key-value` - Table-like key-value pair input
- `data-relation` - Nested form loaded from API
- `data-select` - Async dropdown options

**Container Types** (layout):
- `card` - Visual card container
- `fieldset` - HTML5 fieldset grouping
- `formGroup` - Creates nested object in form value
- `row` - Bootstrap row wrapper
- `col` - Bootstrap column wrapper
- `tabContainer` - Tab navigation container
- `tabPane` - Individual tab content

**Display Types** (non-input):
- `form-text` - Static HTML content display

**Example (Input)**:
```json
{
  "key": "email",
  "type": "input",
  "controlType": "email",
  "label": "Email Address",
  "required": true,
  "validators": [
    { "name": "required", "errorMessage": "Email is required" },
    { "name": "email", "errorMessage": "Must be valid email format" }
  ],
  "helpText": "We'll never share your email with anyone else."
}
```

**Example (Container with Children)**:
```json
{
  "key": "address",
  "type": "formGroup",
  "label": "Address",
  "children": [
    { "key": "street", "type": "input", "label": "Street" },
    { "key": "city", "type": "input", "label": "City" },
    { "key": "zip", "type": "input", "label": "ZIP Code" }
  ]
}
```

**Example (Repeater)**:
```json
{
  "key": "contacts",
  "type": "repeater",
  "label": "Contact Information",
  "children": [
    { "key": "name", "type": "input", "label": "Name" },
    { "key": "phone", "type": "input", "controlType": "tel", "label": "Phone" }
  ],
  "validators": [
    { "name": "minItems", "value": 1 },
    { "name": "maxItems", "value": 5 }
  ],
  "value": [
    { "name": "", "phone": "" }
  ]
}
```

---

### 3. FormButton

Represents an action button in the form (submit, reset, cancel, or custom).

**Fields**:
- `key: string` - Unique identifier (REQUIRED)
- `type: 'submit' | 'reset' | 'cancel' | 'button'` - Button type (REQUIRED)
- `label: string` - Button text (REQUIRED)
- `icon?: string` - Icon class (e.g., 'bi-check-circle')
- `class?: string` - CSS classes (e.g., 'btn-primary btn-lg')
- `settings?: ButtonSettings` - Button configuration
- `callback?: ButtonCallback` - Function to call on click

**Relationships**:
- Belongs to FormConfig

**Validation Rules**:
- `key` MUST be unique within form buttons
- `type` MUST be one of the enumerated values
- If `type` is 'submit', 'reset', or 'cancel', `callback` is optional (default behavior exists)
- If `type` is 'button', `callback` SHOULD be specified (otherwise button does nothing)

**State Transitions**:
1. **Enabled** ↔ **Disabled** (based on `settings.disableIfFormInvalid` and form validity)
2. **Idle** → **Clicked** → **Executing** → **Idle** (button click lifecycle)

**Example (Submit)**:
```json
{
  "key": "submit",
  "type": "submit",
  "label": "Submit Form",
  "icon": "bi-check-circle",
  "class": "btn-success",
  "settings": {
    "disableIfFormInvalid": true
  },
  "callback": {
    "function": "formSubmit"
  }
}
```

**Example (Custom)**:
```json
{
  "key": "preview",
  "type": "button",
  "label": "Preview",
  "icon": "bi-eye",
  "class": "btn-secondary",
  "callback": {
    "function": "showPreview",
    "params": ["preview-mode", true]
  }
}
```

---

### 4. ElementValidator

Represents a validation rule applied to a FormElement.

**Fields**:
- `name: ValidatorName` - Validator identifier (REQUIRED)
- `value?: any` - Validator parameter (e.g., minLength value)
- `errorMessage?: string` - Custom error message override

**ValidatorName Enum**:
- `required` - Field must have a value
- `email` - Must be valid email format
- `minLength` - Minimum string length (value: number)
- `maxLength` - Maximum string length (value: number)
- `pattern` - Regex pattern match (value: string regex)
- `minItems` - Minimum array items (value: number, for repeaters/FormArray)
- `maxItems` - Maximum array items (value: number, for repeaters/FormArray)
- `inArray` - Value must be in allowed list (value: any[])

**Relationships**:
- Belongs to FormElement

**Validation Rules**:
- `name` MUST be one of the supported validator names
- If `name` requires a value parameter (minLength, maxLength, pattern, minItems, maxItems, inArray), `value` MUST be provided
- `value` type MUST match validator requirements (number for length/items, string for pattern, array for inArray)

**Example**:
```json
{
  "name": "minLength",
  "value": 8,
  "errorMessage": "Password must be at least 8 characters long"
}
```

---

### 5. Option

Represents a selectable option for select, radio-group, or checkbox elements.

**Fields**:
- `value: any` - The value submitted with the form (REQUIRED)
- `label: string` - Display text shown to user (REQUIRED)

**Relationships**:
- Belongs to FormElement (select, radio-group, checkbox types only)

**Validation Rules**:
- `value` MUST be JSON-serializable
- `label` MUST be non-empty string
- Within a single element's options array, `value` SHOULD be unique

**Example**:
```json
[
  { "value": "small", "label": "Small" },
  { "value": "medium", "label": "Medium" },
  { "value": "large", "label": "Large" }
]
```

---

### 6. ButtonCallback

Represents a function callback configuration for buttons.

**Fields**:
- `function: string` - Name of function to call (REQUIRED)
- `params?: any[]` - Parameters to pass to function

**Validation Rules**:
- `function` MUST be a valid JavaScript identifier
- `function` name MUST correspond to a method in parent component or event handler

**Built-in Functions**:
- `formSubmit` - Emit onFormSubmit event
- `formCancel` - Emit onFormCancel event
- `formReset` - Reset form to initial values

**Example**:
```json
{
  "function": "saveAndContinue",
  "params": ["draft", true]
}
```

---

### 7. ButtonSettings

Configuration object for button behavior.

**Fields**:
- `disableIfFormInvalid?: boolean` - Disable button when form has validation errors

**Example**:
```json
{
  "disableIfFormInvalid": true
}
```

---

## Derived Data Structures

### FormValue

The output object structure produced when a form is submitted or accessed via `form.value`.

**Structure Rules**:
- Top-level keys match `FormElement.key` values from root elements array
- Nested `formGroup` elements create nested objects
- `repeater` elements create arrays of objects
- `multiple: true` fields create arrays of values
- Non-input elements (containers, display elements) do not contribute to form value

**Example**:

Given FormConfig:
```json
{
  "elements": [
    { "key": "name", "type": "input" },
    {
      "key": "address",
      "type": "formGroup",
      "children": [
        { "key": "street", "type": "input" },
        { "key": "city", "type": "input" }
      ]
    },
    {
      "key": "phones",
      "type": "input",
      "multiple": true
    }
  ]
}
```

Produces FormValue:
```typescript
{
  name: string,
  address: {
    street: string,
    city: string
  },
  phones: string[]
}
```

---

## Data Flow

### 1. Configuration Loading

```
[JSON Source] → HTTP GET → validateFormConfig() → FormConfig object → DynamicFormComponent
```

### 2. Component Instantiation

```
FormConfig.elements → for each element → lookup in form-elements.map.ts →
ViewContainerRef.createComponent() → Component instance → bind to FormControl/FormGroup
```

### 3. User Interaction

```
User input → FormControl.setValue() → Validators.validate() →
Error messages → Display → Form validity update
```

### 4. Form Submission

```
User clicks submit → validate() → if valid → form.value →
emit onFormSubmit(FormGroup) → Parent component handles
```

---

## Invariants

1. **Unique Keys**: All FormElement keys MUST be unique within their parent scope
2. **Tree Structure**: FormElement children MUST form a tree (no cycles)
3. **Type Safety**: Component types MUST exist in registry before instantiation
4. **Validator Consistency**: All validators MUST have corresponding error messages
5. **Value Structure**: FormValue structure MUST match FormElement hierarchy
6. **Immutability**: FormConfig objects SHOULD be treated as immutable after load
7. **State Consistency**: FormControl validity MUST match ElementValidator rules

---

## Performance Considerations

1. **Deep Nesting**: Limit FormElement nesting to 3-5 levels maximum
2. **Repeater Size**: FormArray size > 100 triggers performance warnings
3. **Options Count**: Select/radio options > 100 should use virtual scrolling
4. **Validator Count**: Keep validators per field under 10 for performance
5. **Change Detection**: Container components use OnPush strategy to minimize re-renders
