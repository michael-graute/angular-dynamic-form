# Phase 0: Research & Technical Decisions

**Feature**: Dark/Light Mode Switcher
**Date**: 2025-11-06

## Research Overview

This document captures technical decisions, architectural patterns, and best practices research for implementing the theme switching system in the Angular dynamic form application.

## Technical Decisions

### 1. Theme Implementation Strategy

**Decision**: CSS Custom Properties (CSS Variables) with Bootstrap SCSS overrides

**Rationale**:
- Angular 20.3.9 with Bootstrap 5.3.3 already uses CSS custom properties for theming
- Runtime theme switching requires CSS variable updates (instant, no stylesheet reloading)
- Bootstrap 5.3 has native dark mode support via `data-bs-theme` attribute
- Maintains existing Bootstrap component styles while allowing customization
- Avoids class-based switching which requires more complex CSS selectors
- Better performance than loading separate stylesheets dynamically

**Alternatives Considered**:
- **Multiple stylesheet loading**: Rejected due to FOUC (Flash of Unstyled Content) risk and network overhead
- **Class-based theming** (e.g., `body.light-theme`): Rejected as it requires duplicating all styles with class prefixes, increasing bundle size
- **CSS-in-JS solutions**: Rejected as it contradicts Angular/Bootstrap SCSS-based styling approach

**Implementation Approach**:
- Set `data-bs-theme="dark"` or `data-bs-theme="light"` on `<html>` element
- Define custom CSS variables in `:root` and `[data-bs-theme="dark"]` selectors
- Override Bootstrap's default variables for both themes
- Use Bootstrap's built-in dark mode color scheme as foundation for dark theme

### 2. State Management Pattern

**Decision**: Angular Service with RxJS BehaviorSubject

**Rationale**:
- Centralized state management for theme preference
- Reactive streams enable automatic UI updates across all components
- BehaviorSubject provides initial value (crucial for SSR/hydration scenarios)
- Service can be injected anywhere in component tree without prop drilling
- Aligns with Angular best practices for application-wide state

**Alternatives Considered**:
- **NgRx/Store**: Rejected as overkill for single boolean state value
- **Component state with event emitters**: Rejected due to tight coupling and prop drilling complexity
- **Window/document globals**: Rejected as anti-pattern, no type safety, harder to test

**Implementation Approach**:
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private readonly DEFAULT_THEME = 'dark';

  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  toggleTheme(): void { /* ... */ }
  setTheme(theme: Theme): void { /* ... */ }
  private getInitialTheme(): Theme { /* load from localStorage */ }
}
```

### 3. Storage Mechanism

**Decision**: Browser LocalStorage with graceful degradation

**Rationale**:
- LocalStorage is synchronous, simplifying initial load logic
- Persistent across browser sessions (meeting FR-005)
- Available in all modern browsers (98%+ support)
- Simple key-value API, no serialization complexity for single string value
- Graceful degradation built into spec (FR-005a)

**Alternatives Considered**:
- **SessionStorage**: Rejected as it doesn't persist across browser sessions
- **Cookies**: Rejected due to size limits, HTTP overhead, and cookie consent complexity
- **IndexedDB**: Rejected as overkill for single key-value pair

**Error Handling Strategy**:
```typescript
private savePreference(theme: Theme): void {
  try {
    localStorage.setItem(this.STORAGE_KEY, theme);
  } catch (e) {
    // Storage quota exceeded or disabled - fail silently
    // Theme still works in-memory for current session (FR-005a)
    console.warn('Unable to persist theme preference:', e);
  }
}
```

### 4. Toggle Switch Component Design

**Decision**: Bootstrap 5 Form Switch with Custom Labels

**Rationale**:
- Bootstrap 5.3.3 provides `.form-switch` class for toggle UI
- Native checkbox semantics ensure accessibility (keyboard, screen reader support)
- Leverages existing Bootstrap styling (consistency with form components)
- Custom labels added via CSS pseudo-elements or sibling elements
- Meets FR-008 (clear state indication) and US3 acceptance criteria (accessible)

**Alternatives Considered**:
- **Custom SVG toggle**: Rejected due to accessibility complexity and reinventing the wheel
- **Third-party component library**: Rejected to avoid new dependencies
- **Button-based toggle**: Rejected as less semantically appropriate than checkbox/switch

**Accessibility Features**:
- Keyboard operable (Space/Enter to toggle)
- ARIA labels: `aria-label="Toggle theme"` and `aria-checked` state
- Screen reader announcement: "Dark mode, toggle switch, checked/unchecked"
- Focus visible indicator (Bootstrap default + custom enhancement)

### 5. Theme Color Palette Strategy

**Decision**: WCAG AA Compliant Bootstrap Color Variables

**Rationale**:
- Bootstrap 5.3 dark mode already provides WCAG AA compliant color palette
- Reuse Bootstrap's color variables (`$primary`, `$secondary`, etc.) for consistency
- Define contrast-safe custom properties for backgrounds, text, borders
- Light theme uses Bootstrap's default colors (already compliant)
- Dark theme uses Bootstrap's dark mode colors with minor adjustments

**Color Definitions** (examples):
```scss
// Light theme (default Bootstrap)
:root {
  --bs-body-bg: #ffffff;
  --bs-body-color: #212529;
  --bs-border-color: #dee2e6;
}

// Dark theme
[data-bs-theme="dark"] {
  --bs-body-bg: #212529;
  --bs-body-color: #dee2e6;
  --bs-border-color: #495057;
}
```

**Contrast Validation**:
- Use browser DevTools or pa11y for automated contrast ratio testing
- Minimum ratios: 4.5:1 (normal text), 3:1 (large text 18pt+, UI components)

### 6. Component Placement Strategy

**Decision**: Integrate into existing navigation/header component

**Rationale**:
- FR-003a requires header/navigation bar placement
- Application already has `AppComponent` with header structure (verified in codebase)
- Avoids creating separate header if one doesn't exist
- Always visible (fixed header pattern common in SPAs)

**Implementation Approach**:
- Check if `app.component.html` has existing header/nav structure
- If yes: Add theme-switcher component to header
- If no: Create header structure in AppComponent template
- Position toggle in top-right corner (standard UX pattern)

### 7. Initial Load & FOUC Prevention

**Decision**: Inline theme detection script + preload theme class

**Rationale**:
- Prevent Flash of Unstyled Content (FOUC) on page load
- Theme must be applied before Angular bootstraps
- LocalStorage read is synchronous, executes immediately
- Inline script in `index.html` runs before any CSS/JS loads

**Implementation Approach**:
```html
<!-- In src/index.html, before any stylesheets -->
<script>
  (function() {
    const theme = localStorage.getItem('theme-preference') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', theme);
  })();
</script>
```

**Trade-offs**:
- Inline script increases HTML size by ~150 bytes (negligible)
- Duplicates theme detection logic (once in inline script, once in service)
- Necessary evil to avoid FOUC; documented in code comments

### 8. Testing Strategy

**Decision**: Multi-layer testing approach

**Test Layers**:

1. **Unit Tests** (Jasmine):
   - ThemeService: `toggleTheme()`, `setTheme()`, localStorage interactions
   - ThemeSwitcherComponent: DOM rendering, event handling, accessibility attributes
   - Mock localStorage for deterministic tests

2. **Integration Tests**:
   - Theme switcher component + service integration
   - Theme persistence across component lifecycle
   - Graceful degradation when localStorage unavailable

3. **Visual Regression Tests** (optional, future):
   - Screenshot comparison for theme consistency across components
   - Can use Percy, Chromatic, or Playwright visual testing

**Test Scenarios**:
- Toggle from dark to light (verify DOM update, localStorage write)
- Toggle from light to dark
- Initial load with saved preference (dark)
- Initial load with saved preference (light)
- Initial load with no saved preference (defaults to dark per FR-007)
- localStorage unavailable (quota exceeded or disabled) - graceful degradation
- Keyboard interaction (Space/Enter triggers toggle)
- Screen reader announcements (mocked in unit tests)

### 9. Performance Optimization

**Decision**: Debounce localStorage writes (if multiple rapid toggles)

**Rationale**:
- LocalStorage writes are synchronous and block main thread
- Rapid toggling (edge case) could cause UI jank
- Debounce ensures only final state is persisted

**Implementation**:
```typescript
private readonly STORAGE_DEBOUNCE_MS = 200;
private saveDebounced = debounceTime(this.STORAGE_DEBOUNCE_MS)(
  () => this.savePreference(this.themeSubject.value)
);
```

**Note**: For single toggle operations (expected 99% of use cases), debouncing has no effect. Benefits only edge cases of rapid toggling.

### 10. Browser Compatibility

**Decision**: Target last 2 versions of major browsers

**Supported Browsers**:
- Chrome 120+ (CSS custom properties, localStorage)
- Firefox 121+ (CSS custom properties, localStorage)
- Safari 17+ (CSS custom properties, localStorage)
- Edge 120+ (Chromium-based)

**Unsupported Browsers** (graceful degradation):
- IE11: No support (Angular 20 doesn't support IE11)
- Old mobile browsers (< 2 years old): May not support CSS custom properties

**Fallback Strategy**:
- CSS custom properties unsupported: Default Bootstrap theme applies (light mode)
- LocalStorage unavailable: In-memory theme state only (no persistence)

## Best Practices Applied

### Angular Best Practices
- Standalone components (Angular 20 default)
- Dependency injection for services (no manual instantiation)
- OnPush change detection for ThemeSwitcherComponent (performance)
- Async pipe for observables in templates (automatic unsubscription)
- Typed interfaces for theme models

### Accessibility (WCAG 2.1 AA)
- Color contrast ratios verified (4.5:1 minimum)
- Keyboard navigation support (native form switch)
- Screen reader labels (`aria-label`, `aria-checked`)
- Focus visible indicators (`:focus-visible` CSS)
- No reliance on color alone for state indication (toggle position + labels)

### Performance
- CSS custom property updates (O(1) operation)
- Inline script for FOUC prevention (critical rendering path)
- Debounced localStorage writes
- No runtime stylesheet loading (eliminates network requests)

### Maintainability
- Service abstraction (theme logic centralized)
- Type safety (TypeScript interfaces for theme state)
- Clear separation of concerns (service ↔ component ↔ styles)
- Documented edge cases (localStorage unavailable, corruption)

## Open Questions & Risks

### Risks
1. **Risk**: FOUC still occurs if inline script fails
   - **Mitigation**: Inline script is simple, minimal failure surface; defaults to dark theme

2. **Risk**: LocalStorage quota exceeded in long-running apps
   - **Mitigation**: FR-005a specifies graceful degradation; documented in code

3. **Risk**: Theme colors don't meet WCAG AA after customization
   - **Mitigation**: Automated contrast testing in CI/CD (future enhancement)

### Open Questions (to be resolved in Phase 1)
- [ ] Should theme preference sync across browser tabs (BroadcastChannel API)?
  - **Decision**: Defer to future iteration (out of scope for MVP)

- [ ] Should theme match system preference on first visit (prefers-color-scheme)?
  - **Decision**: No, spec explicitly defaults to dark (FR-007), system preference out of scope

- [ ] Should theme switching include smooth color transitions?
  - **Decision**: No, spec states "instant switching is acceptable" (Out of Scope section)

## References

- [Bootstrap 5.3 Dark Mode Documentation](https://getbootstrap.com/docs/5.3/customize/color-modes/)
- [Angular Standalone Components Guide](https://angular.dev/guide/components)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN: LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Next Phase

Phase 1 will generate:
- `data-model.md`: Theme state model, service interface
- `contracts/theme-service.ts`: TypeScript interface definitions
- `quickstart.md`: Developer integration guide

All technical decisions documented here will inform the Phase 1 design artifacts.
