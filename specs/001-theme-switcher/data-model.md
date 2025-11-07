# Phase 1: Data Model

**Feature**: Dark/Light Mode Switcher
**Date**: 2025-11-06

## Overview

This document defines the data structures, state models, and entities required for the theme switching feature. The theme system is lightweight, managing a single state value (theme preference) with persistence and reactivity.

## Entities

### Theme Preference

Represents the user's selected visual theme. This is the core data entity for the feature.

**Attributes**:
- `theme`: String enum value, either `"dark"` or `"light"`
- `timestamp`: ISO 8601 timestamp of when preference was last changed (optional, for analytics)

**Storage Location**: Browser LocalStorage, key: `"theme-preference"`

**Storage Format**: Plain string value (`"dark"` or `"light"`), not JSON-serialized for simplicity

**Lifecycle**:
1. **Created**: On first user interaction with theme switcher (if no prior preference exists)
2. **Read**: On application bootstrap (inline script + service initialization)
3. **Updated**: Each time user toggles theme
4. **Deleted**: Never (persists indefinitely unless user clears browser data)

**Validation Rules**:
- MUST be one of two values: `"dark"` or `"light"`
- Invalid values (corrupted storage) fall back to default `"dark"` (FR-007)
- Null/undefined treated as "no preference" → defaults to `"dark"`

**Relationships**:
- No relationships to other entities (standalone preference)

---

## State Model

### Application Theme State

The active theme state is managed in-memory by the `ThemeService` and synchronized with the DOM.

**State Properties**:

| Property | Type | Description | Initial Value |
|----------|------|-------------|---------------|
| `currentTheme` | `Theme` enum | Currently active theme | `getInitialTheme()` result |
| `isTransitioning` | `boolean` | Flag indicating theme switch in progress | `false` |

**State Transitions**:

```
Initial State: dark (default) or light (if saved preference)
    │
    ├─→ toggleTheme() ──→ Theme switches (dark ↔ light)
    │                     └─→ DOM updated (data-bs-theme attribute)
    │                     └─→ LocalStorage updated (if available)
    │                     └─→ BehaviorSubject emits new value
    │
    └─→ setTheme(theme) ─→ Theme set to specific value
                          └─→ Same update cascade as toggle
```

**State Invariants**:
- `currentTheme` is always either `"dark"` or `"light"` (never undefined/null)
- DOM `data-bs-theme` attribute always matches `currentTheme` value
- LocalStorage `theme-preference` eventually consistent with `currentTheme` (may lag due to debouncing)

---

## Type Definitions

### TypeScript Interfaces

```typescript
/**
 * Supported theme values
 */
export type Theme = 'dark' | 'light';

/**
 * Theme preference storage structure
 * (Currently just a string, but interface allows future expansion)
 */
export interface ThemePreference {
  theme: Theme;
  timestamp?: string; // ISO 8601, optional for future analytics
}

/**
 * Theme service configuration options
 */
export interface ThemeConfig {
  storageKey: string;
  defaultTheme: Theme;
  debounceMs: number;
}

/**
 * Theme change event (emitted by service observable)
 */
export interface ThemeChangeEvent {
  previousTheme: Theme;
  currentTheme: Theme;
  timestamp: Date;
}
```

**Type Usage**:
- `Theme`: Used everywhere theme value is referenced (service, component, storage)
- `ThemePreference`: Future-proofing for additional metadata (currently only `theme` used)
- `ThemeConfig`: Service initialization options (allows customization in tests)
- `ThemeChangeEvent`: Enriched event data for subscribers who need change history

---

## Storage Schema

### LocalStorage

**Key**: `"theme-preference"`

**Value Format**: Plain string (not JSON)

**Examples**:
```typescript
localStorage.getItem('theme-preference') // Returns: "dark" or "light" or null
localStorage.setItem('theme-preference', 'dark')
localStorage.setItem('theme-preference', 'light')
```

**Why not JSON?**
- Single primitive value (string) doesn't warrant JSON overhead
- Simpler to read/debug in browser DevTools
- Faster parse time (no JSON.parse() call)

**Migration Strategy** (if future expansion needed):
```typescript
// Future: Detect plain string vs JSON object
const stored = localStorage.getItem('theme-preference');
let preference: ThemePreference;

try {
  preference = JSON.parse(stored); // New format
} catch {
  preference = { theme: stored as Theme }; // Legacy format, auto-migrate
}
```

---

## DOM Model

### HTML Attribute

The theme is applied to the document root via a data attribute that Bootstrap's CSS reads.

**Attribute**: `data-bs-theme` on `<html>` element

**Values**: `"dark"` | `"light"`

**Example**:
```html
<html lang="en" data-bs-theme="dark">
  <!-- Dark theme active -->
</html>

<html lang="en" data-bs-theme="light">
  <!-- Light theme active -->
</html>
```

**CSS Selector Pattern**:
```scss
// Bootstrap and custom styles use this selector
[data-bs-theme="dark"] {
  --bs-body-bg: #212529;
  --bs-body-color: #dee2e6;
}

[data-bs-theme="light"] {
  --bs-body-bg: #ffffff;
  --bs-body-color: #212529;
}
```

**Update Mechanism**:
```typescript
// Service updates DOM directly
document.documentElement.setAttribute('data-bs-theme', theme);
```

---

## Validation & Error Handling

### Input Validation

**Theme Value Validation**:
```typescript
function isValidTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

function sanitizeTheme(value: unknown, fallback: Theme = 'dark'): Theme {
  return isValidTheme(value) ? value : fallback;
}
```

**Usage**:
```typescript
// Loading from localStorage
const stored = localStorage.getItem('theme-preference');
const theme = sanitizeTheme(stored, 'dark'); // Always returns valid theme
```

### Storage Error Handling

**LocalStorage Unavailable**:
```typescript
function saveThemePreference(theme: Theme): boolean {
  try {
    localStorage.setItem('theme-preference', theme);
    return true; // Success
  } catch (error) {
    // QuotaExceededError or SecurityError (privacy mode)
    console.warn('Failed to persist theme preference:', error);
    return false; // Graceful degradation - theme still works in-memory
  }
}
```

**Error Recovery**: No automatic retry. Theme continues working in current session without persistence (FR-005a).

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Bootstrap                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Inline Script (index.html)                                  │
│  1. Read localStorage.getItem('theme-preference')            │
│  2. Set <html data-bs-theme="...">                           │
│  3. Prevents FOUC                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ThemeService Initialization (Angular bootstrap)             │
│  1. Read localStorage (duplicate of inline script)           │
│  2. Initialize BehaviorSubject with current theme            │
│  3. Service ready for component injection                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  User Interaction (Toggle Switch Click)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ThemeService.toggleTheme()                                  │
│  1. Determine new theme (dark ↔ light)                       │
│  2. Update BehaviorSubject (emits new value)                 │
│  3. Update DOM: document.documentElement.setAttribute()      │
│  4. Save to localStorage (with error handling)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  CSS Re-evaluation (Browser)                                 │
│  1. [data-bs-theme] selector matches new value               │
│  2. CSS custom properties update                             │
│  3. Components re-render with new colors (<300ms)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Observable Subscribers (Optional)                           │
│  - Components subscribed to theme$ receive new value         │
│  - Example: Analytics, custom theme-aware components         │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Characteristics

| Operation | Complexity | Estimated Time | Notes |
|-----------|------------|----------------|-------|
| Initial theme load | O(1) | <5ms | Synchronous localStorage read |
| Theme toggle | O(1) | <10ms | setAttribute + localStorage write |
| CSS re-evaluation | O(n) | <300ms | n = number of styled elements (browser-dependent) |
| Observable emission | O(m) | <1ms | m = number of subscribers (typically 0-2) |

**Total User-Perceived Latency**: ~300ms (dominated by browser CSS re-evaluation, meets FR-004)

---

## Testing Considerations

### Unit Test Scenarios

**Data Model Tests**:
1. `sanitizeTheme()` with valid input (`"dark"`, `"light"`)
2. `sanitizeTheme()` with invalid input (null, undefined, `"invalid"`)
3. `isValidTheme()` type guard correctness
4. ThemePreference interface serialization (future, if JSON used)

**State Transition Tests**:
1. Initial state: default theme (`"dark"`)
2. Initial state: saved preference (`"light"`)
3. Toggle: dark → light
4. Toggle: light → dark
5. SetTheme: explicit value
6. Storage failure: graceful degradation

### Integration Test Scenarios

1. Service + Component: Toggle switch click updates theme
2. Service + Storage: Theme persists across page reload
3. Service + DOM: `data-bs-theme` attribute updates correctly
4. Inline script + Service: No conflict on bootstrap
5. Storage unavailable: Theme still switchable (in-memory only)

---

## Migration & Versioning

**Current Version**: 1.0 (Initial implementation)

**Future Versioning** (hypothetical):
- **v1.1**: Add `timestamp` to ThemePreference (backward compatible)
- **v2.0**: Add custom theme colors (breaking change, requires JSON storage format)

**Backward Compatibility Strategy**:
- Plain string storage (v1.0) can be detected vs JSON object (future v2.0)
- Auto-migrate on first load if new version deployed

---

## Summary

The theme switching data model is intentionally minimal:
- **Single state value**: `Theme` enum (`"dark"` | `"light"`)
- **Single storage location**: LocalStorage key `"theme-preference"`
- **Single DOM attribute**: `data-bs-theme` on `<html>`
- **Reactive updates**: BehaviorSubject for Angular components

This simplicity ensures reliability, testability, and performance while meeting all functional requirements (FR-001 through FR-012).
