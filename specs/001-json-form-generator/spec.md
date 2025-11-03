# Feature Specification: JSON-Based Dynamic Form Generator

**Feature Branch**: `001-json-form-generator`
**Created**: 2025-10-25
**Status**: Draft
**Input**: User description: "the existing code represents a modular form generation plugin, that lets developers generate frontend forms from json declarations. Please scan the existing code and try to specify this project based on your analysis"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simple Form Creation from JSON Configuration (Priority: P1)

As a developer, I need to create functional forms by providing a JSON configuration object, so that I can rapidly build data entry interfaces without writing repetitive HTML and validation code.

**Why this priority**: This is the core value proposition - enabling developers to generate forms from declarative JSON. Without this, the entire system has no purpose.

**Independent Test**: Can be fully tested by providing a JSON configuration with basic input fields (text, email, password) and verifying that the form renders, accepts input, validates data, and emits form values on submission.

**Acceptance Scenarios**:

1. **Given** a JSON configuration with text and email input fields, **When** the configuration is passed to the form component, **Then** the form renders with the correct field types, labels, and placeholders
2. **Given** a rendered form with validation rules defined in JSON, **When** a user submits invalid data, **Then** appropriate error messages display beneath each invalid field
3. **Given** a valid form submission, **When** the user clicks submit, **Then** the form emits a structured object containing all field values matching the JSON key structure
4. **Given** a JSON configuration with required fields, **When** required fields are empty, **Then** the submit button is disabled (if configured) and error messages appear

---

### User Story 2 - Loading Forms from Remote API Endpoints (Priority: P2)

As a developer, I need to load form configurations from remote API endpoints, so that form structures can be managed server-side and updated without deploying frontend code changes.

**Why this priority**: This enables dynamic, data-driven applications where form structures are determined at runtime based on user permissions, feature flags, or business rules.

**Independent Test**: Can be tested by providing an API URL to the form component, verifying the HTTP request is made, and confirming the returned JSON configuration renders correctly as a functional form.

**Acceptance Scenarios**:

1. **Given** a valid API endpoint URL, **When** the form component initializes, **Then** an HTTP request fetches the form configuration and the form renders
2. **Given** an API endpoint that returns form configuration with validation rules, **When** the form loads, **Then** all validators are active and function correctly
3. **Given** a slow or failing API endpoint, **When** the form attempts to load, **Then** a loading indicator displays and appropriate error handling occurs on failure
4. **Given** a successfully loaded form configuration, **When** the configuration is received, **Then** an event is emitted allowing the parent component to react to the loaded configuration

---

### User Story 3 - Dynamic Field Arrays (Repeaters) (Priority: P2)

As a user filling out a form, I need to add or remove multiple instances of field groups dynamically, so that I can provide variable quantities of related information (e.g., multiple email addresses, multiple addresses).

**Why this priority**: Critical for real-world data entry scenarios where the quantity of items isn't known in advance. Common in CRM, survey, and admin applications.

**Independent Test**: Can be tested by configuring a repeater field in JSON with add/remove buttons, verifying users can add new field groups, remove existing ones, and that form values correctly reflect the array structure.

**Acceptance Scenarios**:

1. **Given** a repeater field with initial values, **When** the form renders, **Then** the correct number of field groups display with pre-populated values
2. **Given** a repeater field, **When** the user clicks the add button, **Then** a new empty field group appears and the form value array grows
3. **Given** multiple repeater field groups, **When** the user clicks remove on a specific group, **Then** that group disappears and its values are removed from the form data
4. **Given** a repeater with min/max item validators, **When** the user attempts to add beyond the maximum or remove below the minimum, **Then** the appropriate buttons are disabled and validation messages display

---

### User Story 4 - Asynchronous Dropdown Options (Priority: P2)

As a user filling out a form, I need dropdown menus that load their options from server APIs, so that I can select from up-to-date, centralized data sources (e.g., list of countries, product categories, user names).

**Why this priority**: Essential for enterprise applications where dropdown options come from databases and must stay synchronized across multiple forms.

**Independent Test**: Can be tested by configuring a data-select field with an API URL, verifying the API is called on field initialization, and confirming the returned options populate the dropdown correctly.

**Acceptance Scenarios**:

1. **Given** a data-select field with an asyncURL configured, **When** the form renders, **Then** an HTTP request is made to the specified URL
2. **Given** an API that returns an array of objects, **When** the response is received, **Then** the dropdown populates with options using the configured valueKey and display properties
3. **Given** a data-select field with a selected value, **When** the form is submitted, **Then** the selected value (not the full object) is included in the form data
4. **Given** a failing API endpoint for dropdown options, **When** the request fails, **Then** the dropdown remains empty or shows a placeholder, and an error is logged

---

### User Story 5 - Complex Layout with Tabs, Cards, and Responsive Grid (Priority: P3)

As a developer, I need to organize form fields using layout containers (tabs, cards, rows/columns), so that complex forms with many fields are visually organized and user-friendly.

**Why this priority**: Important for user experience in complex forms, but the core form functionality works without advanced layouts.

**Independent Test**: Can be tested by configuring a JSON structure with tab containers, card containers, and responsive grid (row/col) elements, then verifying the visual layout matches the configuration.

**Acceptance Scenarios**:

1. **Given** a form with tab container configuration, **When** the form renders, **Then** tabs display correctly and clicking a tab shows its associated fields
2. **Given** a form with card containers, **When** the form renders, **Then** fields are visually grouped within bordered card elements with optional labels
3. **Given** a form with row and column layout elements, **When** the form renders on different screen sizes, **Then** the responsive grid layout adjusts appropriately
4. **Given** nested layout containers (tabs containing cards containing grids), **When** the form renders, **Then** all nesting levels render correctly and fields function properly

---

### User Story 6 - Form Group Nesting for Structured Data (Priority: P3)

As a developer, I need to define nested form groups in JSON configuration, so that the submitted form values have a structured, hierarchical object shape matching my data model.

**Why this priority**: Important for API integration and data modeling, but not required for basic form functionality.

**Independent Test**: Can be tested by configuring a formGroup element with nested children, submitting the form, and verifying the output object has the correct nested structure.

**Acceptance Scenarios**:

1. **Given** a formGroup with key "address" containing street and city fields, **When** the form is submitted, **Then** the form value includes an "address" object with "street" and "city" properties
2. **Given** multiple nested formGroups, **When** the form is submitted, **Then** the output object structure matches the nesting hierarchy defined in the configuration
3. **Given** a formGroup with validation rules, **When** validation fails on child fields, **Then** the formGroup is marked as invalid

---

### User Story 7 - Custom Validation Rules with Configurable Error Messages (Priority: P2)

As a developer, I need to define validation rules in the JSON configuration with custom error messages, so that users receive clear, context-specific feedback on input errors.

**Why this priority**: Validation is critical for data integrity and user experience. Custom error messages are essential for professional applications.

**Independent Test**: Can be tested by configuring validators (required, email, minLength, pattern, etc.) in JSON with custom error messages, then verifying that validation triggers correctly and displays the specified messages.

**Acceptance Scenarios**:

1. **Given** a field with a required validator and custom error message, **When** the field is empty and touched, **Then** the custom error message displays
2. **Given** an email field with email validator, **When** an invalid email is entered, **Then** the email validation error message appears
3. **Given** a field with multiple validators (minLength and pattern), **When** validation fails, **Then** the appropriate error message for the failing validator displays
4. **Given** a field with minItems/maxItems validators on a repeater, **When** the item count violates the constraint, **Then** the corresponding error message appears
5. **Given** an inArray validator with allowed values, **When** a value not in the allowed list is entered, **Then** the inArray error message displays listing the expected values

---

### User Story 8 - Pre-populating Forms with Existing Data (Priority: P2)

As a developer, I need to load existing data into the form (for editing scenarios), so that users can update previously saved information rather than re-entering everything.

**Why this priority**: Essential for edit/update workflows, which are present in nearly all CRUD applications.

**Independent Test**: Can be tested by calling the loadFormData method with a data object, then verifying all form fields populate with the corresponding values from the object.

**Acceptance Scenarios**:

1. **Given** an existing data object matching the form structure, **When** loadFormData is called, **Then** all matching form fields populate with the provided values
2. **Given** form data including arrays (for repeaters), **When** loadFormData is called, **Then** the correct number of repeater groups render with pre-filled values
3. **Given** nested form groups in the data object, **When** loadFormData is called, **Then** nested fields populate correctly
4. **Given** partial data (some fields missing), **When** loadFormData is called, **Then** provided fields populate while missing fields remain empty

---

### User Story 9 - Multiple Values per Field (FormArray Inputs) (Priority: P3)

As a user filling out a form, I need to provide multiple values for a single field type (e.g., multiple email addresses, multiple phone numbers), so that I can enter all relevant data without complex workarounds.

**Why this priority**: Useful feature for specific use cases, but not required for core functionality. Can be achieved with repeaters as an alternative.

**Independent Test**: Can be tested by configuring an input or select field with "multiple: true", verifying add/remove buttons appear, and confirming the form value is an array.

**Acceptance Scenarios**:

1. **Given** an input field configured with multiple:true and initial values, **When** the form renders, **Then** multiple input fields appear with add/remove buttons
2. **Given** a multiple-value field, **When** the user clicks add, **Then** a new empty input field appears
3. **Given** multiple input fields, **When** the user clicks remove on a specific field, **Then** that field and its value are removed
4. **Given** a multiple-value field with validation, **When** any individual value is invalid, **Then** the field is marked invalid and error messages display

---

### User Story 10 - Custom Button Callbacks (Priority: P3)

As a developer, I need to define custom buttons with callback functions in the form configuration, so that I can trigger application-specific actions beyond standard submit/reset/cancel.

**Why this priority**: Adds flexibility for custom workflows, but standard form submission handles most use cases.

**Independent Test**: Can be tested by configuring a button with a custom callback function name and parameters, clicking the button, and verifying the callback event is emitted with the correct payload.

**Acceptance Scenarios**:

1. **Given** a button with a custom callback function name, **When** the button is clicked, **Then** an event is emitted containing the function name and parameters
2. **Given** a custom button with parameters defined, **When** the button is clicked, **Then** the event payload includes the specified parameters
3. **Given** multiple custom buttons, **When** each button is clicked, **Then** the corresponding callback is emitted with the correct function name
4. **Given** a button configured with disableIfFormInvalid setting, **When** the form is invalid, **Then** the button is disabled

---

### Edge Cases

- What happens when the JSON configuration contains an invalid or unrecognized field type?
- How does the system handle circular references or deeply nested form structures (10+ levels)?
- What happens when an async URL (form config or data-select) returns an error or times out?
- How does the form handle extremely large datasets (1000+ repeater items or dropdown options)?
- What happens when form data is loaded before the form configuration is fully initialized?
- How does validation behave when validators reference values that don't exist in the form?
- What happens when a user rapidly adds/removes repeater items while async operations are pending?
- How does the system handle conflicting validators (e.g., minLength and maxLength with min > max)?
- What happens when attempting to populate form data with mismatched data types (string where number expected)?
- How does the form handle browser back/forward navigation when async form config is involved?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render form fields dynamically based on a provided JSON configuration object
- **FR-002**: System MUST support standard HTML5 input types (text, email, password, number, date, datetime-local, time, week, month, url, tel, search)
- **FR-003**: System MUST support select dropdowns with static option lists defined in JSON
- **FR-004**: System MUST support checkbox and radio-group input types with configurable options
- **FR-005**: System MUST support repeater fields allowing users to add/remove dynamic arrays of field groups
- **FR-006**: System MUST support form validation including required, email, minLength, maxLength, pattern, minItems, maxItems, and inArray validators
- **FR-007**: System MUST display validation error messages beneath invalid fields, with support for custom error message text
- **FR-008**: System MUST emit form value objects when submit action is triggered
- **FR-009**: System MUST support loading form configurations asynchronously from HTTP endpoints
- **FR-010**: System MUST support pre-populating forms with existing data via a data loading method
- **FR-011**: System MUST support data-select fields that load dropdown options asynchronously from HTTP endpoints
- **FR-012**: System MUST support layout containers including cards, fieldsets, rows, columns, and tab containers
- **FR-013**: System MUST support formGroup elements to create nested object structures in form values
- **FR-014**: System MUST support multiple values per field (FormArray) for input and select types
- **FR-015**: System MUST support configurable buttons with types: submit, reset, cancel, and custom callbacks
- **FR-016**: System MUST support key-value input type for table-like data entry
- **FR-017**: System MUST support data-relation fields that load nested form configurations from HTTP endpoints
- **FR-018**: System MUST support form-text elements for displaying static HTML content within forms
- **FR-019**: System MUST support floating label styles for input fields
- **FR-020**: System MUST allow custom CSS classes to be applied to form elements via JSON configuration
- **FR-021**: System MUST support onChange callbacks for individual field value changes
- **FR-022**: System MUST support disabling buttons conditionally based on form validity state
- **FR-023**: System MUST support help text displayed beneath form fields
- **FR-024**: System MUST validate form inputs in real-time as users interact with fields
- **FR-025**: System MUST support setting initial/default values for fields via JSON configuration
- **FR-026**: System MUST support displaying loading indicators during async operations
- **FR-027**: System MUST allow developers to access the underlying form state (values, validity, errors) programmatically
- **FR-028**: System MUST support icons on buttons via configurable icon classes
- **FR-029**: System MUST emit events for form submit, cancel, reset, config loaded, and custom button callbacks
- **FR-030**: System MUST preserve form value structure matching the hierarchical key structure defined in JSON

### Key Entities *(include if feature involves data)*

- **Form Configuration**: Represents the complete declarative structure of a form including elements, buttons, settings, and callbacks. Contains arrays of FormElement and FormButton objects.

- **Form Element**: Represents a single form component (input, select, container, etc.) with properties including type, key, label, validators, options, children, settings, and styling. Can be nested to create hierarchical structures.

- **Form Button**: Represents an action button with properties including type (submit/reset/cancel/button), label, icon, CSS classes, callback configuration, and conditional display rules.

- **Validator**: Represents a validation rule applied to a form element, including validator name (required, email, minLength, etc.), validation value/parameter, and custom error message text.

- **Form Value**: Represents the structured data output of the form, with keys matching form element keys and structure matching nesting (formGroups, repeaters, etc.). Contains user-entered data in a JSON-serializable format.

- **Async Configuration**: Represents the URL and loading state for remotely-loaded form configurations or field options, including the endpoint URL, loading status, and error state.

- **Option**: Represents a selectable choice for select, radio-group, or checkbox elements, including value (submitted with form) and label (displayed to user).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can create a functional form with 5-10 fields by providing only a JSON configuration object, with no additional HTML or component code required
- **SC-002**: Form configurations loaded from remote APIs render within 2 seconds on standard network connections
- **SC-003**: Forms correctly validate user input and display error messages within 100ms of field blur events
- **SC-004**: Forms with up to 50 fields and 3 levels of nesting render and remain responsive (interactions complete within 200ms)
- **SC-005**: Developers can integrate the form component into an existing application in under 30 minutes using provided documentation
- **SC-006**: 95% of common form use cases (data entry, surveys, settings panels) can be implemented using only JSON configuration without custom code
- **SC-007**: Form submissions produce correctly-structured data objects that can be sent directly to REST APIs without transformation for 90% of use cases
- **SC-008**: Repeater fields support adding/removing up to 100 field groups without performance degradation
- **SC-009**: Async dropdown fields load and display options from APIs returning up to 500 items without noticeable delay
- **SC-010**: Forms accurately preserve and restore data when users navigate away and return to the page
- **SC-011**: Validation error messages are clear and actionable, reducing user confusion and support requests
- **SC-012**: The system handles network failures gracefully, providing clear feedback when remote configurations or data fail to load

### Assumptions

- Developers using this system have basic knowledge of JSON syntax and web forms
- The application runs on Angular 20.3.9 with TypeScript 5.9.3 in modern browsers supporting ES6+ JavaScript
- Form configurations will be provided as valid JSON (validation of configuration structure is not guaranteed)
- HTTP endpoints for async operations return data in expected formats (form component does not validate API response schemas)
- Developers are responsible for server-side validation and data persistence
- The system assumes reasonable form sizes (under 100 fields) for optimal performance
- Custom validation logic beyond built-in validators requires developer implementation
- Styling beyond basic layout is handled by the parent application's CSS framework
- The system uses reactive forms approach (not template-driven forms)
- Button callbacks and onChange handlers are defined in the parent component consuming the form
- The system assumes a single form instance per component scope (multiple forms require multiple component instances)

## Clarifications

### Session 2025-11-03

- Q: Should @angular/cdk installation target version 20 to match Angular 20.3.9, version 19 as originally planned, or latest regardless? → A: Option A - Install @angular/cdk@20 to match the Angular 20.3.9 version (recommended for compatibility)
- Q: Should documentation reference TypeScript 5.9.3 (current package.json), keep 5.5.2 (original plan), or downgrade? → A: Option A - Update all documentation to reference TypeScript 5.9.3 (matches current package.json)
- Q: Should Angular 20 standalone component patterns be verified before implementation, proceed with Angular 19 patterns, or defer migration? → A: Option A - Add verification task to research Angular 20-specific standalone component patterns and ViewContainerRef APIs
- Q: Should performance targets (2s async, 100ms validation, 200ms interactions) be maintained, relaxed, or made more aggressive for Angular 20? → A: Option A - Maintain current performance targets (2s async, 100ms validation, 200ms interactions) and validate with Angular 20 benchmarks
- Q: Should documentation reference Jasmine 5.12.1 (current package.json), keep 5.1.0, or downgrade? → A: Option A - Update plan to reference Jasmine 5.12.1 (matches package.json, ensures accurate documentation)

## Out of Scope

- Visual form builder UI for generating JSON configurations (this is a runtime rendering library only)
- Server-side form processing, data persistence, or API integration
- Advanced conditional logic (show/hide fields based on other field values) beyond basic validator-based disabling
- Multi-step wizard logic (stepping through sections) beyond layout organization
- File upload inputs
- Rich text editor inputs (WYSIWYG)
- Date range pickers (start/end date combinations)
- Autocomplete/type-ahead inputs with search filtering
- Drag-and-drop interfaces for reordering repeater items
- Form analytics or user behavior tracking
- Accessibility features beyond standard HTML semantics (ARIA attributes, screen reader optimization)
- Internationalization/localization of error messages (can be achieved via custom error messages in JSON)
- Form state persistence to browser storage (localStorage/sessionStorage)
- Undo/redo functionality for form edits
- Collaborative real-time form editing
- PDF or document export of form data
- Integration with specific backend frameworks or databases
