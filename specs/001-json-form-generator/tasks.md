# Implementation Tasks: JSON-Based Dynamic Form Generator

**Feature Branch**: `001-json-form-generator`
**Date**: 2025-10-25
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Overview

This document contains all implementation tasks for the Angular Dynamic Form Generator, organized by user story to enable independent, incremental delivery. The project is an **existing codebase** being enhanced with modern patterns and additional capabilities.

**Total Tasks**: 103 (updated 2025-11-03 for Angular 20.3.9)
**User Stories**: 10 (P1: 1, P2: 5, P3: 4)
**Parallel Opportunities**: 43 tasks marked [P]

## Implementation Strategy

**MVP Scope**: User Story 1 (Simple Form Creation from JSON Configuration)
- Delivers core value: JSON → rendered form with validation
- Independently testable and deployable
- Foundation for all other stories

**Incremental Delivery**:
1. **Phase 1-2**: Setup & Foundation (blocking prerequisites)
2. **Phase 3**: US1 - MVP (JSON form creation, validation, submission)
3. **Phase 4+**: Additional user stories in priority order (P2 stories, then P3 stories)
4. **Final Phase**: Cross-cutting concerns (performance, documentation, polish)

**Parallel Execution**: Tasks marked [P] can be executed concurrently when working on different files or independent features.

---

## Phase 1: Setup & Infrastructure

**Goal**: Prepare development environment and project structure for Angular 20.3.9 patterns.

**Tasks**:

- [X] T001 Install @angular/cdk package for virtual scrolling support (npm install @angular/cdk@20 to match Angular 20.3.9)
- [X] T002 Install zod package for runtime JSON validation (npm install zod)
- [X] T003 [P] Update tsconfig.json to enable strict mode if not already enabled (already enabled)
- [X] T004 [P] Create performance testing configuration in angular.json (add budgets for 100-field forms)
- [X] T005 [P] Set up Jasmine custom matchers for form validation testing in src/test-helpers/form-matchers.ts
- [X] T006A [P] Research and verify Angular 20.3.9 standalone component patterns and ViewContainerRef API compatibility (clarification 2025-11-03) - See angular-20-verification.md

---

## Phase 2: Foundational Enhancements

**Goal**: Implement blocking prerequisites that benefit all user stories (modern Angular patterns, type safety, performance foundation).

**Dependencies**: Phase 1 must complete first (including T006A Angular 20 verification).

**Tasks**:

### Architecture Modernization

- [X] T006 [P] Convert AbstractInputComponent to standalone component in src/app/dynamic-form/form-elements/abstract/abstract-input.component.ts (using verified Angular 20 patterns)
- [X] T007 [P] Convert AbstractFormElementHostComponent to standalone in src/app/dynamic-form/form-elements/abstract/abstract-form-element-host.component.ts (using verified Angular 20 patterns)
- [X] T008 [P] Update DynamicFormComponent to standalone in src/app/dynamic-form/dynamic-form.component.ts (using verified Angular 20 patterns)
- [X] T009 Update form-elements.map.ts to use ViewContainerRef.createComponent() API (modern Angular 20 pattern verified in T006A) - Already using modern API, added type safety

### Runtime Validation & Type Safety

- [X] T010 [P] Create Zod schema for FormConfig in src/app/dynamic-form/schemas/form-config.schema.ts
- [X] T011 [P] Create Zod schema for FormElement (recursive) in src/app/dynamic-form/schemas/form-element.schema.ts
- [X] T012 [P] Create Zod schema for FormButton in src/app/dynamic-form/schemas/form-button.schema.ts
- [X] T013 [P] Create Zod schema for ElementValidator in src/app/dynamic-form/schemas/element-validator.schema.ts
- [X] T014 Implement validateFormConfig() function in src/app/dynamic-form/validators/config-validator.ts
- [X] T015 Add type guards (isFormElement, hasChildren, etc.) to src/app/dynamic-form/type-guards/form-type-guards.ts
- [X] T016 Integrate runtime validation into DynamicFormService.loadForm() in src/app/dynamic-form/dynamic-form.service.ts

### Performance Foundation

- [X] T017 [P] Add OnPush change detection to DynamicFormComponent in src/app/dynamic-form/dynamic-form.component.ts
- [X] T018 [P] Add trackBy functions to all *ngFor directives in DynamicFormComponent template
- [X] T019 Create performance monitoring service in src/app/dynamic-form/services/performance-monitor.service.ts
- [X] T020 [P] Add performance budget warnings for 50+ fields in DynamicFormComponent

### Async Enhancement Foundation

- [X] T021 Implement caching layer with TTL in DynamicFormService (5-min TTL for configs, 10-min for dropdowns)
- [X] T022 Add retry logic with exponential backoff to HTTP requests in DynamicFormService
- [X] T023 [P] Create LoadingState interface in src/app/dynamic-form/types/loading-state.ts
- [X] T024 Implement loading state management in DynamicFormService (BehaviorSubject pattern)

---

## Phase 3: User Story 1 - Simple Form Creation from JSON Configuration (P1)

**Goal**: Enable developers to create functional forms from JSON with validation and submission.

**Why P1**: Core value proposition - without this, the system has no purpose.

**Independent Test Criteria**:
- Create JSON config with text, email, password inputs
- Pass config to DynamicFormComponent
- Verify form renders with correct field types
- Enter invalid data, verify error messages appear
- Submit valid data, verify form value object matches JSON structure
- Test with required fields empty, verify submit button disabled

**Dependencies**: Phase 2 (foundational changes) must complete first.

**Parallel Opportunities**: Component conversions (T026-T030), example updates (T035-T036).

**Tasks**:

### Core Components

- [X] T025 [US1] Convert InputComponent to standalone in src/app/dynamic-form/form-elements/inputs/input/input.component.ts (Angular 20 default)
- [X] T026 [P] [US1] Convert SelectComponent to standalone in src/app/dynamic-form/form-elements/inputs/select/select.component.ts (Angular 20 default)
- [X] T027 [P] [US1] Convert CheckboxComponent to standalone in src/app/dynamic-form/form-elements/inputs/checkbox/checkbox.component.ts (Angular 20 default)
- [X] T028 [P] [US1] Convert RadioGroupComponent to standalone in src/app/dynamic-form/form-elements/inputs/radio-group/radio-group.component.ts (Angular 20 default)
- [X] T029 [P] [US1] Add OnPush change detection to InputComponent
- [X] T030 [P] [US1] Add OnPush change detection to SelectComponent

### Validation Enhancement

- [X] T031 [US1] Update DynamicFormValidators to support all 8 validator types (verify existing: required, email, minLength, maxLength, pattern, minItems, maxItems, inArray)
- [X] T032 [US1] Enhance error message interpolation in default-error-messages.ts (support {expected}, {actual} placeholders)
- [X] T033 [US1] Add custom error message override logic in AbstractInputComponent (already implemented in ngOnInit)

### Form Submission & Events

- [X] T034 [US1] Implement form submission flow with validation check in DynamicFormComponent
- [X] T035 [P] [US1] Update simple-form example to use standalone components in src/app/examples/simple-form/ (already using standalone)
- [X] T036 [P] [US1] Add validation examples to simple-form (required, email, minLength)

---

## Phase 4: User Story 2 - Loading Forms from Remote API Endpoints (P2)

**Goal**: Enable dynamic form loading from server APIs with loading states and error handling.

**Independent Test Criteria**:
- Provide asyncUrl to DynamicFormComponent
- Verify HTTP GET request is made to URL
- Verify loading indicator displays during fetch
- Verify form renders when config received
- Test with failing endpoint, verify error handling
- Test onFormConfigLoaded event emission

**Dependencies**: US1 (core form rendering must work).

**Parallel Opportunities**: Caching tests (T039), error handling (T040), example creation (T042).

**Tasks**:

- [X] T037 [US2] Implement asyncUrl input handling in DynamicFormComponent (already implemented)
- [X] T038 [US2] Add HTTP client injection and form config fetching in DynamicFormComponent (already implemented)
- [X] T039 [P] [US2] Add caching for remote form configs in DynamicFormService (already implemented in Phase 2)
- [X] T040 [P] [US2] Implement error handling for failed HTTP requests with user-friendly messages (already implemented in Phase 2)
- [X] T041 [US2] Add loading spinner component in src/app/dynamic-form/components/loading-spinner/loading-spinner.component.ts
- [X] T042 [P] [US2] Create simple-ajax-form example in src/app/examples/simple-ajax-form/ using asyncUrl
- [X] T043 [US2] Add mock API endpoint in public/mock-api/user-registration-form.json

---

## Phase 5: User Story 7 - Custom Validation Rules with Configurable Error Messages (P2)

**Goal**: Enable JSON-defined validation with custom error messages for professional user experience.

**Independent Test Criteria**:
- Define validators in JSON with custom errorMessage
- Trigger validation (touch field, submit form)
- Verify custom error message displays (not default)
- Test multiple validators on same field, verify correct message shown
- Test minItems/maxItems on repeater, verify messages appear

**Dependencies**: US1 (validation foundation exists).

**Parallel Opportunities**: Validator enhancements (T044-T046), message templates (T047-T048).

**Tasks**:

- [X] T044 [P] [US7] Enhance minItems validator in DynamicFormValidators to support custom messages (already implemented)
- [X] T045 [P] [US7] Enhance maxItems validator in DynamicFormValidators to support custom messages (already implemented)
- [X] T046 [P] [US7] Enhance inArray validator in DynamicFormValidators with value interpolation (already implemented)
- [X] T047 [P] [US7] Update error message templates in default-error-messages.ts with {expected} {actual} placeholders (already implemented in Phase 3)
- [X] T048 [P] [US7] Add error message override logic to all input components via AbstractInputComponent (already implemented in Phase 3)
- [X] T049 [US7] Create validation-examples component in src/app/examples/validation-examples/ demonstrating all validators

---

## Phase 6: User Story 8 - Pre-populating Forms with Existing Data (P2)

**Goal**: Enable form data loading for edit/update workflows.

**Independent Test Criteria**:
- Create form with multiple field types
- Call loadFormData() or populateFormData() with data object
- Verify all fields populate with matching values
- Test with nested formGroups, verify nested data populates
- Test with repeater arrays, verify correct number of items render
- Test with partial data, verify missing fields stay empty

**Dependencies**: US1 (form rendering), US6 (nested formGroups if testing nested data).

**Parallel Opportunities**: Service methods (T050-T051), example creation (T052).

**Tasks**:

- [X] T050 [P] [US8] Implement loadFormData() method in DynamicFormService (HTTP GET + populate)
- [X] T051 [P] [US8] Implement populateFormData() method in DynamicFormService (direct object → form values)
- [X] T052 [P] [US8] Add form data population handling for nested FormGroups
- [X] T053 [US8] Add form data population handling for FormArray (repeaters)
- [X] T054 [US8] Create edit-user-form example in src/app/examples/edit-user-form/ demonstrating data pre-population

---

## Phase 7: User Story 3 - Dynamic Field Arrays (Repeaters) (P2)

**Goal**: Enable add/remove field groups for variable-length data entry.

**Independent Test Criteria**:
- Configure repeater field in JSON with children
- Render form, verify initial items display
- Click add button, verify new group appears
- Click remove button, verify group disappears
- Verify form value is array of objects
- Test minItems/maxItems validators, verify buttons disabled at limits

**Dependencies**: US1 (form rendering), US7 (minItems/maxItems validators).

**Parallel Opportunities**: Component conversion (T055), button styling (T057), example creation (T059).

**Tasks**:

- [X] T055 [P] [US3] Convert RepeaterComponent to standalone in src/app/dynamic-form/form-elements/inputs/repeater/repeater.component.ts (Angular 20 default)
- [X] T056 [US3] Add OnPush change detection to RepeaterComponent
- [X] T057 [P] [US3] Implement add/remove button logic in RepeaterComponent
- [X] T058 [US3] Add trackBy function for repeater items (track by index or unique ID)
- [X] T059 [P] [US3] Update form-inputs example to include repeater with add/remove in src/app/examples/form-inputs/
- [X] T060 [US3] Add minItems/maxItems validation enforcement (disable add/remove buttons at limits)

---

## Phase 8: User Story 4 - Asynchronous Dropdown Options (P2)

**Goal**: Enable dropdowns that load options from APIs for centralized data sources.

**Independent Test Criteria**:
- Configure data-select field with asyncURL and valueKey
- Render form, verify HTTP request made to asyncURL
- Verify dropdown populates with returned options
- Select option, submit form, verify value (not full object) in form data
- Test failing endpoint, verify error handling

**Dependencies**: US1 (form rendering), US2 (async loading pattern established).

**Parallel Opportunities**: Component conversion (T061), caching (T063), example creation (T065).

**Tasks**:

- [X] T061 [P] [US4] Convert DataSelectComponent to standalone in src/app/dynamic-form/form-elements/inputs/data-select/data-select.component.ts (Angular 20 default)
- [X] T062 [US4] Implement asyncURL option loading in DataSelectComponent (HTTP GET on init)
- [X] T063 [P] [US4] Add caching for dropdown options in DynamicFormService (10-min TTL)
- [X] T064 [US4] Add valueKey extraction logic to use correct property as form value
- [X] T065 [P] [US4] Create data-select-example in src/app/examples/data-select-example/ with mock API
- [X] T066 [US4] Add mock API endpoint for dropdown options in public/mock-api/user-list.json

---

## Phase 9: User Story 5 - Complex Layout with Tabs, Cards, and Responsive Grid (P3)

**Goal**: Enable visual organization of complex forms with layout containers.

**Independent Test Criteria**:
- Configure form with tabContainer, tabPane, card, row, col elements
- Render form, verify tabs display
- Click tabs, verify content switches
- Verify cards visually group fields
- Test responsive grid on different screen sizes

**Dependencies**: US1 (form rendering).

**Parallel Opportunities**: All container component conversions (T067-T073).

**Tasks**:

- [X] T067 [P] [US5] Convert CardComponent to standalone in src/app/dynamic-form/form-elements/containers/card/card.component.ts (Angular 20 default)
- [X] T068 [P] [US5] Convert FieldsetComponent to standalone in src/app/dynamic-form/form-elements/containers/fieldset/fieldset.component.ts (Angular 20 default)
- [X] T069 [P] [US5] Convert RowComponent to standalone in src/app/dynamic-form/form-elements/containers/row/row.component.ts (Angular 20 default)
- [X] T070 [P] [US5] Convert ColComponent to standalone in src/app/dynamic-form/form-elements/containers/col/col.component.ts (Angular 20 default)
- [X] T071 [P] [US5] Convert TabContainerComponent to standalone in src/app/dynamic-form/form-elements/containers/tab-container/tab-container.component.ts (Angular 20 default)
- [X] T072 [P] [US5] Convert TabPaneComponent to standalone in src/app/dynamic-form/form-elements/containers/tab-pane/tab-pane.component.ts (Angular 20 default)
- [X] T073 [US5] Add OnPush change detection to all container components
- [X] T074 [US5] Update form-layouts example with tabs, cards, grid in src/app/examples/form-layouts/

---

## Phase 10: User Story 6 - Form Group Nesting for Structured Data (P3)

**Goal**: Enable nested object structures in form values for API integration.

**Independent Test Criteria**:
- Configure formGroup with children fields
- Submit form, verify form value has nested object structure
- Test multiple nested formGroups (2-3 levels)
- Verify validation on child fields marks formGroup invalid

**Dependencies**: US1 (form rendering).

**Parallel Opportunities**: Component conversion (T075), example creation (T077).

**Tasks**:

- [X] T075 [P] [US6] Convert FormGroupComponent to standalone in src/app/dynamic-form/form-elements/containers/form-group/form-group.component.ts (Angular 20 default)
- [X] T076 [US6] Add OnPush change detection to FormGroupComponent
- [X] T077 [P] [US6] Add nested formGroup examples to form-layouts example in src/app/examples/form-layouts/
- [X] T078 [US6] Verify formGroup validation propagation (child invalid → parent invalid)

---

## Phase 11: User Story 9 - Multiple Values per Field (FormArray Inputs) (P3)

**Goal**: Enable multiple values for single field types (e.g., multiple emails).

**Independent Test Criteria**:
- Configure input field with multiple:true
- Render form, verify add/remove buttons appear
- Add multiple values, verify form value is array
- Validate individual values, verify errors display per field

**Dependencies**: US1 (form rendering), US3 (FormArray pattern established with repeaters).

**Parallel Opportunities**: Multiple input handling (T079), validation (T081).

**Tasks**:

- [X] T079 [P] [US9] Add multiple-value support to InputComponent (check `multiple` config, render FormArray)
- [X] T080 [US9] Add add/remove buttons for multiple-value inputs in InputComponent template
- [X] T081 [P] [US9] Implement per-value validation for multiple-value fields
- [X] T082 [US9] Add multipleLabel display for multiple-value groups
- [X] T083 [US9] Add example of multiple-value input to form-inputs example in src/app/examples/form-inputs/

---

## Phase 12: User Story 10 - Custom Button Callbacks (P3)

**Goal**: Enable application-specific button actions beyond standard form buttons.

**Independent Test Criteria**:
- Configure button with custom callback function name and params
- Click button, verify onCustomCallBack event emitted
- Verify event payload contains function name and params
- Test button with disableIfFormInvalid, verify disabled when form invalid

**Dependencies**: US1 (form rendering).

**Parallel Opportunities**: Button logic (T084), event handling (T085), example creation (T086).

**Tasks**:

- [X] T084 [P] [US10] Implement custom button callback logic in DynamicFormComponent (emit onCustomCallBack event)
- [X] T085 [P] [US10] Add disableIfFormInvalid logic to button rendering in DynamicFormComponent
- [X] T086 [P] [US10] Create custom-callbacks example in src/app/examples/custom-callbacks/ demonstrating save-draft button
- [X] T087 [US10] Update FormButton handling to support callback parameter passing

---

## Phase 13: Performance & Scalability

**Goal**: Implement performance optimizations for large forms and datasets.

**Dependencies**: All user stories (core functionality must exist to optimize).

**Parallel Opportunities**: Virtual scrolling integrations (T088-T089), performance tests (T090-T092).

**Tasks**:

### Virtual Scrolling

- [X] T088 [P] Integrate CDK VirtualScrollViewport into RepeaterComponent for >50 items
- [X] T089 [P] Integrate CDK VirtualScrollViewport into DataSelectComponent for >100 options
- [X] T090 [P] Add viewport size calculation based on item height in RepeaterComponent

### Performance Testing

- [X] T091 [P] Create performance benchmark tests for 10, 50, 100 field forms in src/app/dynamic-form/performance/form-performance.spec.ts
- [X] T092 [P] Create performance benchmark tests for repeaters with 50, 100, 200 items
- [X] T093 [P] Add performance monitoring to form rendering (measure time from config → render complete)
- [X] T094 Add warning logs for forms exceeding performance budgets (>100 fields, >100 repeater items)

---

## Phase 14: Documentation & Polish

**Goal**: Update documentation, examples, and provide migration guidance.

**Dependencies**: All user stories complete.

**Parallel Opportunities**: All documentation tasks can run in parallel (T095-T102).

**Tasks**:

### Documentation

- [ ] T095 [P] Update main README.md with Angular 20 and Zod validation
- [ ] T096 [P] Add JSDoc comments to all public methods in DynamicFormComponent
- [ ] T097 [P] Add JSDoc comments to all public methods in DynamicFormService
- [ ] T098 [P] Add JSDoc comments to DynamicFormValidators class methods
- [ ] T099 [P] Create MIGRATION.md guide for upgrading from NgModule to standalone components
- [ ] T100 [P] Add performance guidelines to README (field limits, repeater limits, optimization tips)

### Examples Polish

- [ ] T101 [P] Add code comments to all examples explaining JSON configuration patterns
- [ ] T102 [P] Create comprehensive-form example combining all features (tabs, repeaters, validation, async loading)

---

## Task Dependencies & Execution Order

### Critical Path

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1) → Remaining User Stories
```

### User Story Dependencies

| Story | Depends On | Reason |
|-------|------------|--------|
| US1 | Phase 1-2 | Foundation required |
| US2 | US1 | Needs form rendering |
| US3 | US1, US7 | Needs rendering + minItems/maxItems validators |
| US4 | US1, US2 | Needs rendering + async pattern |
| US5 | US1 | Needs form rendering |
| US6 | US1 | Needs form rendering |
| US7 | US1 | Extends validation |
| US8 | US1 | Needs form rendering |
| US9 | US1, US3 | Needs rendering + FormArray pattern |
| US10 | US1 | Needs form rendering |

### Parallel Execution Examples

**Phase 2 Parallel Track**:
```
Track A: T006, T007, T008 (standalone conversions)
Track B: T010, T011, T012, T013 (Zod schemas)
Track C: T017, T018, T020 (performance foundation)
Track D: T021, T022, T024 (async enhancements)
```

**Phase 3 (US1) Parallel Track**:
```
Track A: T026, T027, T028 (component conversions)
Track B: T029, T030 (OnPush updates)
Track C: T035, T036 (example updates)
```

**Phase 9 (US5) Parallel Track**:
```
All container conversions: T067-T072 (6 parallel tasks)
```

---

## Independent Testing Per User Story

### US1 Test Scenario
```typescript
// Create simple form config
const config = {
  elements: [
    { key: 'email', type: 'input', controlType: 'email', required: true },
    { key: 'password', type: 'input', controlType: 'password', validators: [{ name: 'minLength', value: 8 }] }
  ],
  buttons: [{ key: 'submit', type: 'submit', label: 'Submit' }]
};

// Test: Form renders
expect(component.form.controls['email']).toBeDefined();

// Test: Validation works
component.form.controls['email'].setValue('invalid');
expect(component.form.controls['email'].errors).toEqual({ email: true });

// Test: Submit with valid data
component.form.setValue({ email: 'test@example.com', password: 'password123' });
component.formSubmit();
expect(onFormSubmitSpy).toHaveBeenCalledWith(jasmine.objectContaining({ valid: true }));
```

### US2 Test Scenario
```typescript
// Test: Async form loading
component.asyncUrl = '/api/forms/test-form';
component.ngOnInit();

// Verify HTTP request made
expect(httpMock.expectOne('/api/forms/test-form')).toBeTruthy();

// Test: Loading state
expect(component.loading).toBe(true);

// Return mock config
httpMock.flush(mockFormConfig);

// Verify form rendered
expect(component.formConfig).toEqual(mockFormConfig);
expect(component.loading).toBe(false);
```

### US3 Test Scenario
```typescript
// Configure repeater
const config = {
  elements: [{
    key: 'contacts',
    type: 'repeater',
    children: [
      { key: 'name', type: 'input' },
      { key: 'email', type: 'input', controlType: 'email' }
    ],
    value: [{ name: '', email: '' }]
  }]
};

// Test: Add item
const addButton = fixture.nativeElement.querySelector('.add-button');
addButton.click();
expect(component.form.value.contacts.length).toBe(2);

// Test: Remove item
const removeButton = fixture.nativeElement.querySelector('.remove-button');
removeButton.click();
expect(component.form.value.contacts.length).toBe(1);
```

---

## Summary

**Total Tasks**: 103 (updated 2025-11-03 for Angular 20.3.9)
**Phases**: 14
**Parallel Tasks**: 43 (marked with [P])
**User Stories**: 10

**MVP Scope** (Recommended First Delivery):
- Phase 1: Setup (6 tasks, including Angular 20 verification)
- Phase 2: Foundation (19 tasks)
- Phase 3: US1 - Simple Form Creation (12 tasks)
- **Total MVP**: 37 tasks

**Incremental Delivery Order**:
1. MVP (US1) - 36 tasks
2. US2 (Async loading) - 7 tasks
3. US7 (Custom validation) - 6 tasks
4. US8 (Data pre-population) - 5 tasks
5. US3 (Repeaters) - 6 tasks
6. US4 (Async dropdowns) - 6 tasks
7. US5 (Layouts) - 8 tasks
8. US6 (Nested formGroups) - 4 tasks
9. US9 (Multiple values) - 5 tasks
10. US10 (Custom buttons) - 4 tasks
11. Performance (7 tasks)
12. Documentation (8 tasks)

Each phase delivers independently testable functionality that provides value to users.
