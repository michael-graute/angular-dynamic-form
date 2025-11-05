# Migration Guide: NgModule to Standalone Components

This guide helps you migrate from NgModule-based Angular applications to standalone components when using the Angular Dynamic Form Generator.

## Overview

As of version 2.0, the Angular Dynamic Form Generator has been fully migrated to **Angular 20.3.9 standalone components**. This migration provides:

- ✅ Simpler imports and reduced boilerplate
- ✅ Better tree-shaking and smaller bundles
- ✅ Improved performance with OnPush change detection
- ✅ Modern Angular patterns and best practices

## Quick Migration Checklist

- [ ] Upgrade to Angular 20.3.9 or later
- [ ] Remove `DynamicFormModule` imports
- [ ] Update component imports to use standalone components
- [ ] Update routing configuration (if using lazy loading)
- [ ] Test all forms thoroughly
- [ ] Update any custom form elements

## Step-by-Step Migration

### Step 1: Upgrade Angular

```bash
# Upgrade to Angular 20.3.9
ng update @angular/core@20 @angular/cli@20

# Verify version
ng version
```

### Step 2: Remove NgModule Imports

**Before (NgModule)**:
```typescript
import { NgModule } from '@angular/core';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    DynamicFormModule,
    // other modules
  ]
})
export class AppModule { }
```

**After (Standalone)**:
```typescript
// No module import needed!
// Import components directly where used
```

### Step 3: Update Component Usage

**Before (NgModule)**:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html'
})
export class MyFormComponent {
  // component logic
}
```

**After (Standalone)**:
```typescript
import { Component } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-my-form',
  standalone: true,  // Add standalone flag
  imports: [DynamicFormComponent],  // Import components directly
  templateUrl: './my-form.component.html'
})
export class MyFormComponent {
  // component logic
}
```

### Step 4: Update Main Application Bootstrap

**Before (NgModule)**:
```typescript
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**After (Standalone)**:
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // other providers
  ]
}).catch(err => console.error(err));
```

### Step 5: Update Routing Configuration

**Before (NgModule)**:
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**After (Standalone)**:
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'form',
    loadComponent: () => import('./form/form.component').then(m => m.FormComponent)
  }
];
```

### Step 6: Update Service Providers

**Before (NgModule)**:
```typescript
@NgModule({
  providers: [DynamicFormService]
})
export class AppModule { }
```

**After (Standalone)**:
```typescript
// Services with providedIn: 'root' work automatically
// No need to provide them explicitly

// If you need to provide a service at component level:
@Component({
  selector: 'app-my-form',
  standalone: true,
  providers: [DynamicFormService]  // Component-level provider
})
```

## Common Patterns

### Pattern 1: Simple Form Component

```typescript
import { Component } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormConfig } from './dynamic-form/dynamic-form.types';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <fg-dynamic-form
      id="userForm"
      [formConfig]="formConfig"
      (onFormSubmit)="handleSubmit($event)"
    />
  `
})
export class UserFormComponent {
  formConfig: FormConfig = {
    // your configuration
  };

  handleSubmit(form: FormGroup) {
    console.log(form.getRawValue());
  }
}
```

### Pattern 2: Async Form Loading

```typescript
import { Component } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormConfig } from './dynamic-form/dynamic-form.types';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-async-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <fg-dynamic-form
      id="asyncForm"
      asyncUrl="/api/forms/user-registration"
      (onFormSubmit)="handleSubmit($event)"
      (onFormConfigLoaded)="onLoaded($event)"
    />
  `
})
export class AsyncFormComponent {
  handleSubmit(form: FormGroup) {
    console.log(form.getRawValue());
  }

  onLoaded(config: FormConfig) {
    console.log('Form loaded:', config);
  }
}
```

### Pattern 3: Custom Form Elements

If you have custom form elements, update them to standalone:

**Before (NgModule)**:
```typescript
@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html'
})
export class CustomInputComponent extends AbstractInputComponent {
  // component logic
}

@NgModule({
  declarations: [CustomInputComponent],
  exports: [CustomInputComponent]
})
export class CustomInputModule { }
```

**After (Standalone)**:
```typescript
@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './custom-input.component.html'
})
export class CustomInputComponent extends AbstractInputComponent {
  // component logic
}
```

## Testing

### Unit Tests

**Before (NgModule)**:
```typescript
import { TestBed } from '@angular/core/testing';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [DynamicFormModule],
    declarations: [MyComponent]
  }).compileComponents();
});
```

**After (Standalone)**:
```typescript
import { TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { provideHttpClient } from '@angular/common/http';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent, DynamicFormComponent],
    providers: [provideHttpClient()]
  }).compileComponents();
});
```

## Breaking Changes

### Removed

- ❌ `DynamicFormModule` - No longer exists
- ❌ Module-based lazy loading - Use `loadComponent` instead
- ❌ `forRoot()` pattern - Not needed with standalone

### Changed

- ✅ Component imports - Now direct imports instead of module imports
- ✅ Routing - Uses `loadComponent` instead of `loadChildren`
- ✅ Testing - Import components directly in TestBed

### Deprecated

Nothing deprecated - this is a clean migration.

## Benefits of Standalone Components

### 1. Simpler Imports

**Before**: Import module → declare in NgModule → use component
**After**: Import component → use directly

### 2. Better Tree-Shaking

Standalone components enable better dead code elimination, resulting in smaller bundle sizes.

### 3. Lazy Loading

Loading individual components is more granular than loading entire modules.

### 4. Reduced Boilerplate

No need to maintain separate module files for every component.

### 5. Modern Angular

Aligns with Angular's future direction and best practices.

## Troubleshooting

### Issue: "Component is not standalone"

**Error**: `Component 'DynamicFormComponent' is not standalone and cannot be imported directly.`

**Solution**: Ensure you're using the latest version of the library. All components are now standalone.

### Issue: "HttpClient not provided"

**Error**: `NullInjectorError: No provider for HttpClient!`

**Solution**: Add `provideHttpClient()` to your application providers:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // other providers
  ]
});
```

### Issue: "Router not working"

**Error**: Router links not navigating

**Solution**: Provide router configuration:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // other providers
  ]
});
```

### Issue: "Forms not working"

**Error**: `Can't bind to 'formGroup' since it isn't a known property`

**Solution**: Import `ReactiveFormsModule` in your component:

```typescript
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent]
})
```

## Migration Checklist by Feature

### Basic Forms
- [x] Update component imports
- [x] Remove module imports
- [x] Test form rendering
- [x] Test form submission

### Async Loading
- [x] Update HttpClient providers
- [x] Test async form loading
- [x] Test error handling
- [x] Verify caching works

### Custom Validators
- [x] Test all 8 built-in validators
- [x] Test custom error messages
- [x] Test error interpolation

### Repeaters
- [x] Test add/remove items
- [x] Test minItems/maxItems validation
- [x] Test virtual scrolling (>50 items)

### Dropdowns
- [x] Test async dropdown loading
- [x] Test virtual scrolling (>100 options)
- [x] Test valueKey/labelKey

### Layouts
- [x] Test tabs functionality
- [x] Test cards and fieldsets
- [x] Test grid system
- [x] Test nested formGroups

### Performance
- [x] Verify OnPush change detection
- [x] Test virtual scrolling
- [x] Verify performance warnings
- [x] Run performance tests

## Additional Resources

- [Angular Standalone Components Guide](https://angular.io/guide/standalone-components)
- [Angular Migration Guide](https://angular.io/guide/standalone-migration)
- [Angular 20 Release Notes](https://github.com/angular/angular/releases)

## Support

If you encounter issues during migration:

1. Check this guide for common patterns
2. Review the examples in the `/examples` directory
3. Check the GitHub issues
4. Create a new issue with migration details

## Version Compatibility

| Library Version | Angular Version | Status |
|----------------|-----------------|--------|
| 2.0+ | 20.3.9+ | ✅ Supported |
| 1.x | 19.x | ⚠️ Legacy (NgModules) |

---

**Need Help?** Check the [README.md](README.md) for usage examples or create an issue on GitHub.
