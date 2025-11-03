# Angular 20.3.9 Standalone Component Pattern Verification

**Date**: 2025-11-03
**Task**: T006A - Research and verify Angular 20.3.9 standalone component patterns and ViewContainerRef API compatibility
**Status**: ✅ VERIFIED - Patterns are compatible and enhanced

---

## Executive Summary

Angular 20 standalone component patterns are **fully backward compatible** with Angular 19 patterns while introducing **enhanced capabilities**. The existing implementation plan can proceed without modification, with optional enhancements available.

---

## ViewContainerRef.createComponent() API

### ✅ Status: Compatible and Enhanced

Angular 20 continues to support the Angular 19 pattern while deprecating the factory-based approach.

### Recommended Pattern (Angular 20)

```typescript
// Direct component instantiation (recommended)
const componentRef = viewContainerRef.createComponent(MyComponent, {
  index: 0,
  injector: this.injector,
  environmentInjector: this.environmentInjector,
  projectableNodes: [],
  directives: [],  // NEW in Angular 20
  bindings: []     // NEW in Angular 20
});
```

### Legacy Pattern (Deprecated)

```typescript
// Factory-based (deprecated, but still works)
const factory = componentFactoryResolver.resolveComponentFactory(MyComponent);
const componentRef = viewContainerRef.createComponent(factory);
```

### Angular 20 Enhancements

1. **Declarative Bindings**: New `bindings` array parameter
   - `inputBinding(inputName, value)` - Bind input properties
   - `outputBinding(outputName, callback)` - Bind output events
   - `twoWayBinding(propertyName, signal)` - Two-way binding support

2. **Directives Array**: New `directives` parameter
   - Apply host directives to dynamically created components
   - Supports `DirectiveWithBindings` for directive input/output configuration

3. **Type Safety**: Enhanced TypeScript support for component types

---

## Standalone Components

### ✅ Status: Fully Supported

Standalone components work identically to module-based components with `createComponent()`.

```typescript
// Standalone component example
@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<div>Dynamic Content</div>`
})
export class DynamicComponent {}

// Usage - same as non-standalone
const componentRef = viewContainerRef.createComponent(DynamicComponent);
```

**Key Point**: No special handling required for standalone vs non-standalone components.

---

## Breaking Changes

### None Affecting Current Implementation

- The factory-based API is deprecated but **still functional**
- Migration to direct component instantiation is **recommended but not required**
- All Angular 19 patterns work in Angular 20

---

## Recommendations for Implementation

### 1. Use Direct Component Instantiation ✅

**Current plan (tasks.md T009)** already specifies:
> "Update form-elements.map.ts to use ViewContainerRef.createComponent() API (modern Angular 20 pattern)"

This aligns perfectly with Angular 20's recommended approach.

### 2. Avoid ComponentFactory ✅

Do not use:
- `ComponentFactoryResolver.resolveComponentFactory()`
- Factory-based `createComponent()` overload

Use instead:
```typescript
viewContainerRef.createComponent(ComponentType, options)
```

### 3. Optional Enhancements for Future

Consider leveraging Angular 20's new features in later phases:

**Bindings API** (for more declarative dynamic component configuration):
```typescript
import { inputBinding, outputBinding } from '@angular/core';

const componentRef = viewContainerRef.createComponent(InputComponent, {
  bindings: [
    inputBinding('label', 'Email Address'),
    inputBinding('required', true),
    outputBinding('valueChange', (value) => console.log(value))
  ]
});
```

**Benefits**:
- More declarative than manual property assignment
- Type-safe input/output binding
- Better alignment with template syntax

---

## Implementation Impact Assessment

| Task | Impact | Action Required |
|------|--------|-----------------|
| T006-T008 (Standalone conversions) | ✅ No change | Proceed as planned |
| T009 (ViewContainerRef API) | ✅ No change | Current plan is optimal |
| T025-T030 (Component conversions) | ✅ No change | Standalone pattern verified |
| All Phase 2+ tasks | ✅ No change | All patterns compatible |

---

## Code Pattern Verification

### ✅ Form Elements Map Pattern (T009)

**Current implementation approach (from plan.md)**:
```typescript
// form-elements.map.ts
export const FORM_ELEMENT_TYPES: Map<string, Type<AbstractFormElementHostComponent>> = new Map([
  ['input', InputComponent],
  ['select', SelectComponent],
  // ...
]);

// Dynamic instantiation
const componentType = FORM_ELEMENT_TYPES.get(element.type);
if (componentType) {
  const componentRef = viewContainerRef.createComponent(componentType, {
    injector: this.injector
  });
}
```

**Verdict**: ✅ This pattern is the Angular 20 recommended approach.

---

## OnPush Change Detection with Standalone Components

### ✅ Status: Fully Compatible

```typescript
@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class InputComponent {}
```

**Confirmed**: OnPush works identically for standalone and module-based components.

---

## Conclusion

### ✅ All Angular 20 patterns verified and compatible

1. **Standalone components**: Fully supported, no special handling needed
2. **ViewContainerRef.createComponent()**: Direct instantiation is the recommended pattern
3. **Change detection**: OnPush works as expected
4. **Dynamic component loading**: No breaking changes from Angular 19

### Implementation can proceed as planned

All tasks in the implementation plan (Phase 1-14) are compatible with Angular 20.3.9. The planned patterns align with Angular 20 best practices.

### Optional future enhancements

Consider adopting Angular 20's bindings API in Phase 13 (Performance & Scalability) for:
- More declarative dynamic component configuration
- Improved type safety
- Better alignment with Angular template syntax

---

## References

- [Angular 20 ViewContainerRef API](https://angular.dev/api/core/ViewContainerRef)
- [Angular 20 createComponent Function](https://angular.dev/api/core/createComponent)
- [Programmatically Rendering Components](https://angular.dev/guide/components/programmatic-rendering)
- [Angular 20 Release Notes](https://angular.love/angular-20-whats-new/)

---

**Verification Status**: ✅ COMPLETE
**Next Task**: Proceed with Phase 2 (Foundational Enhancements)
