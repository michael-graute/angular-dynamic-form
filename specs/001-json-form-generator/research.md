# Research: Angular Dynamic Form Generator Best Practices

**Date**: 2025-10-25
**Feature**: JSON-Based Dynamic Form Generator
**Purpose**: Establish technical decisions and design patterns for maintaining and extending the form library

## 1. Angular 19 Component Architecture Best Practices

### Decision: Use Standalone Components with Dynamic Instantiation

**Rationale**:
- Angular 19 strongly favors standalone components (modules being phased out)
- Standalone components reduce bundle size and simplify dependency management
- Dynamic component instantiation via ViewContainerRef remains fully supported
- Better tree-shaking and lazy-loading capabilities

**Alternatives Considered**:
- **NgModule-based architecture**: Deprecated pattern, adds unnecessary boilerplate, larger bundle sizes
- **Component inheritance without dynamic instantiation**: Loses flexibility for runtime type selection from JSON

**Implementation Guidance**:
- Mark all form element components as `standalone: true`
- Use `ViewContainerRef.createComponent()` for dynamic instantiation (modern API)
- Leverage Angular's dependency injection for services in standalone components
- Import only required dependencies directly in component decorators
- Use component registry map (existing form-elements.map.ts pattern) for type-to-component mapping

**Code Pattern**:
```typescript
@Component({
  selector: 'fg-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: '...'
})
export class InputComponent extends AbstractInputComponent {
  // Component implementation
}
```

## 2. Reactive Forms Advanced Patterns

### Decision: Use Typed FormGroups with Nested FormBuilder Pattern

**Rationale**:
- TypeScript 4.5+ provides typed forms (FormGroup<T>) for better type safety
- Nested FormBuilder pattern scales to arbitrary nesting depth
- FormArray with trackBy functions optimizes change detection for large datasets
- Centralized validator composition in DynamicFormValidators class maintains consistency

**Alternatives Considered**:
- **Template-driven forms**: Violates Component-Based Architecture principle, poor performance for dynamic forms
- **Untyped FormControl**: Loses compile-time type checking, increases runtime errors
- **Flat form structure**: Doesn't support hierarchical data models required by formGroup element type

**Implementation Guidance**:
- Use `FormBuilder.group()` recursively for nested formGroup elements
- Implement `trackBy` functions in repeater components to track by index or unique ID
- Keep FormArray size monitoring with performance warnings at 100+ items
- Use `updateValueAndValidity()` strategically to avoid excessive validation cycles
- Implement debouncing for validation on large forms (300ms default)

**Performance Optimization**:
```typescript
// In repeater component
trackByIndex(index: number, item: any): number {
  return index;
}

// Disable validation during bulk operations
formArray.controls.forEach(control => {
  control.patchValue(value, { emitEvent: false });
});
formArray.updateValueAndValidity(); // Single validation pass
```

## 3. Performance Testing & Optimization

### Decision: Multi-layer Performance Strategy (Profiling + Optimization + Testing)

**Rationale**:
- Chrome DevTools + Angular DevTools provide comprehensive profiling
- OnPush change detection strategy reduces unnecessary re-renders
- Virtual scrolling via CDK ScrollingModule handles large lists efficiently
- Lighthouse CI integration enables regression detection

**Alternatives Considered**:
- **Manual performance testing only**: Not scalable, misses regressions
- **Default change detection**: Causes performance degradation with 50+ fields
- **Custom virtual scrolling**: Reinvents wheel, CDK solution is battle-tested

**Implementation Guidance**:

**Phase 1: Profiling**
- Use Angular DevTools profiler to identify slow components
- Measure time to render forms with 50, 100, 150 fields
- Profile repeater with 50, 100, 200 items
- Identify O(n²) operations in validation or rendering

**Phase 2: Optimization Techniques**
- Apply `ChangeDetectionStrategy.OnPush` to all form element components
- Implement `trackBy` functions for all *ngFor directives
- Use `async` pipe for observables to auto-manage subscriptions
- Detach change detector during bulk FormArray operations
- Lazy-load heavy components (e.g., rich text editors if added)

**Phase 3: Virtual Scrolling**
- Integrate `@angular/cdk/scrolling` for repeater fields > 50 items
- Implement virtual scrolling for data-select dropdowns > 100 options
- Configure viewport size based on item height (calculate dynamically)

**Code Pattern**:
```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'fg-repeater',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="80" class="viewport">
      <div *cdkVirtualFor="let item of items; trackBy: trackByIndex">
        <!-- Repeater item template -->
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
```

**Phase 4: Performance Testing**
- Create benchmark tests using Jasmine performance utilities
- Measure rendering time for various form sizes (10, 50, 100 fields)
- Set performance budgets: 1s for 100 fields, 200ms for interactions
- Run Lighthouse CI in GitHub Actions to catch regressions

## 4. Async Data Loading Patterns

### Decision: RxJS-based Loading State Management with Error Recovery

**Rationale**:
- RxJS operators provide composable async patterns (retry, timeout, catchError)
- Centralized loading state in DynamicFormService avoids component duplication
- Exponential backoff retry prevents server hammering on failures
- Cache with TTL reduces redundant API calls for dropdown options

**Alternatives Considered**:
- **Promise-based async**: Harder to compose, no built-in retry/timeout operators
- **Component-level loading state**: Duplicated logic across components, harder to test
- **No caching**: Unnecessary API calls, poor offline experience

**Implementation Guidance**:

**Loading State Pattern**:
```typescript
interface LoadingState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

// In DynamicFormService
private formConfigState = new BehaviorSubject<LoadingState<FormConfig>>({
  loading: false,
  data: null,
  error: null
});

loadForm(url: string): Observable<FormConfig> {
  this.formConfigState.next({ loading: true, data: null, error: null });

  return this.http.get<FormConfig>(url).pipe(
    timeout(5000),
    retry({
      count: 3,
      delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000) // Exponential backoff
    }),
    tap(data => this.formConfigState.next({ loading: false, data, error: null })),
    catchError(error => {
      this.formConfigState.next({ loading: false, data: null, error });
      return throwError(() => error);
    })
  );
}
```

**Caching Strategy**:
- Implement in-memory cache for form configurations with 5-minute TTL
- Cache dropdown options per URL with 10-minute TTL
- Provide cache invalidation method for refreshing stale data
- Use `shareReplay(1)` to prevent duplicate HTTP requests for same URL

**Race Condition Handling**:
- Use `switchMap` for user-triggered requests (cancels previous request)
- Use `exhaustMap` for form submissions (ignore rapid clicks until complete)
- Implement request deduplication for identical concurrent requests

**Code Pattern**:
```typescript
private cache = new Map<string, { data: any, timestamp: number }>();
private TTL = 5 * 60 * 1000; // 5 minutes

private getCached<T>(key: string): T | null {
  const cached = this.cache.get(key);
  if (cached && Date.now() - cached.timestamp < this.TTL) {
    return cached.data;
  }
  return null;
}

loadFormWithCache(url: string): Observable<FormConfig> {
  const cached = this.getCached<FormConfig>(url);
  if (cached) {
    return of(cached);
  }

  return this.loadForm(url).pipe(
    tap(data => this.cache.set(url, { data, timestamp: Date.now() }))
  );
}
```

## 5. JSON Schema Validation

### Decision: Runtime Validation with TypeScript Type Guards and Zod Schema

**Rationale**:
- TypeScript interfaces provide compile-time safety but no runtime validation
- Zod library provides runtime validation with TypeScript type inference
- Type guards enable safe narrowing of unknown JSON input
- Detailed error messages guide developers to fix configuration issues

**Alternatives Considered**:
- **JSON Schema + AJV**: More verbose, separate schema from TypeScript types, harder to maintain
- **TypeScript interfaces only**: No runtime validation, crashes on malformed JSON
- **Manual validation**: Error-prone, hard to maintain, inconsistent error messages

**Implementation Guidance**:

**Phase 1: Define Zod Schemas**
```typescript
import { z } from 'zod';

// Validator schema
const ElementValidatorSchema = z.object({
  name: z.enum(['required', 'email', 'minLength', 'maxLength', 'pattern', 'minItems', 'maxItems', 'inArray']),
  value: z.any().optional(),
  errorMessage: z.string().optional()
});

// FormElement schema (recursive)
const FormElementSchema: z.ZodType<FormElement> = z.lazy(() => z.object({
  key: z.string(),
  type: z.string(),
  label: z.string().optional(),
  value: z.any().optional(),
  required: z.boolean().optional(),
  validators: z.array(ElementValidatorSchema).optional(),
  options: z.array(z.object({
    value: z.any(),
    label: z.string()
  })).optional(),
  children: z.array(FormElementSchema).optional(),
  settings: z.record(z.any()).optional(),
  class: z.string().optional()
}));

// FormConfig schema
const FormConfigSchema = z.object({
  elements: z.array(FormElementSchema),
  buttons: z.array(z.object({
    key: z.string(),
    type: z.enum(['submit', 'reset', 'button', 'cancel']),
    label: z.string(),
    class: z.string().optional(),
    icon: z.string().optional(),
    callback: z.object({
      function: z.string(),
      params: z.array(z.any()).optional()
    }).optional()
  })).optional(),
  settings: z.record(z.any()).optional()
});

// Type inference
type FormConfig = z.infer<typeof FormConfigSchema>;
```

**Phase 2: Validation Function**
```typescript
function validateFormConfig(config: unknown): FormConfig {
  try {
    return FormConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const readable = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');

      throw new Error(
        `Invalid form configuration:\n${readable}\n\n` +
        `Please check your JSON structure against the FormConfig schema.`
      );
    }
    throw error;
  }
}
```

**Phase 3: Type Guards**
```typescript
function isFormElement(obj: any): obj is FormElement {
  return obj && typeof obj.key === 'string' && typeof obj.type === 'string';
}

function hasChildren(element: FormElement): element is FormElement & { children: FormElement[] } {
  return Array.isArray(element.children);
}
```

**Phase 4: Integration**
```typescript
// In DynamicFormService
loadForm(url: string): Observable<FormConfig> {
  return this.http.get(url).pipe(
    map(data => validateFormConfig(data)), // Runtime validation
    catchError(error => {
      console.error('Form configuration validation failed:', error);
      return throwError(() => error);
    })
  );
}
```

**Benefits**:
- Catch malformed JSON at load time, not at render time
- Provide clear error messages pointing to exact issue
- Maintain single source of truth for types (Zod schema → TypeScript types)
- Enable auto-completion and IntelliSense in IDEs

## Summary of Key Decisions

| Area | Decision | Primary Benefit |
|------|----------|-----------------|
| Component Architecture | Standalone components with dynamic instantiation | Modern Angular patterns, smaller bundles |
| Forms | Typed FormGroups with nested FormBuilder | Type safety, scales to deep nesting |
| Performance | OnPush + Virtual Scrolling + Profiling | Handles 100+ fields/items smoothly |
| Async | RxJS with retry/cache/loading states | Resilient, efficient data loading |
| Validation | Zod schema with type guards | Runtime safety + great DX |

## Next Steps (Phase 1)

1. Create data-model.md documenting FormConfig, FormElement, FormButton entities
2. Generate TypeScript interface contracts in contracts/ directory
3. Create quickstart.md with integration examples
4. Update agent context with Angular 19, RxJS, Zod dependencies
5. Re-evaluate Constitution Check post-design
