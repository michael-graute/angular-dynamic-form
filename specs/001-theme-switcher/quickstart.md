# Quick Start Guide: Dark/Light Mode Switcher

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**For**: Angular 20.3.9 + Bootstrap 5.3.3

## Overview

This guide provides step-by-step instructions for integrating and using the theme switching feature in the Angular dynamic form application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Advanced Usage](#advanced-usage)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Dependencies

The theme switcher requires these dependencies (already present in the project):

```json
{
  "@angular/core": "^20.3.9",
  "@angular/common": "^20.3.9",
  "bootstrap": "^5.3.3",
  "rxjs": "~7.8.0"
}
```

### Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+ (Chromium)

**Note**: IE11 not supported (Angular 20 requirement).

---

## Installation

### Step 1: Import ThemeService

The `ThemeService` is provided at root level, so it's automatically available throughout your application. No manual import needed in `main.ts` or `app.config.ts`.

### Step 2: Add Theme Switcher to Header

In your `app.component.html` (or wherever your navigation/header is):

```html
<!-- app.component.html -->
<header class="navbar navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Angular Form Generator</a>

    <!-- Add theme switcher to the right side of navbar -->
    <div class="d-flex align-items-center">
      <app-theme-switcher></app-theme-switcher>
    </div>
  </div>
</header>

<main class="container-fluid py-4">
  <router-outlet></router-outlet>
</main>
```

### Step 3: Import ThemeSwitcher Component

In your `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitcherComponent } from './shared/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular Form Generator';
}
```

### Step 4: Add FOUC Prevention Script

In `src/index.html`, add this inline script **before** the `<link>` tags for stylesheets:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular Form Generator</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- FOUC Prevention: Load theme before CSS renders -->
  <script>
    (function() {
      try {
        const theme = localStorage.getItem('theme-preference') || 'dark';
        document.documentElement.setAttribute('data-bs-theme', theme);
      } catch (e) {
        // LocalStorage unavailable, default theme applied
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      }
    })();
  </script>

  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Step 5: Verify Installation

1. Start the development server: `ng serve`
2. Navigate to `http://localhost:4200`
3. Look for the theme toggle switch in the header
4. Click to switch between dark and light themes
5. Refresh the page - theme should persist

---

## Basic Usage

### Using the Theme Switcher Component

The simplest integration is to use the pre-built `ThemeSwitcherComponent`:

```html
<!-- Anywhere in your templates -->
<app-theme-switcher></app-theme-switcher>
```

**Component Features**:
- Toggle switch UI (Bootstrap form-switch)
- Dark/Light labels
- Keyboard accessible (Space/Enter to toggle)
- Screen reader compatible
- Automatic state sync with ThemeService

### Programmatic Theme Control

If you need to control the theme programmatically (e.g., in a settings page):

```typescript
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { Theme } from './core/models/theme.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings-panel">
      <h3>Appearance</h3>

      <div class="btn-group" role="group">
        <button
          class="btn btn-outline-primary"
          [class.active]="currentTheme === 'dark'"
          (click)="setTheme('dark')">
          Dark
        </button>
        <button
          class="btn btn-outline-primary"
          [class.active]="currentTheme === 'light'"
          (click)="setTheme('light')">
          Light
        </button>
      </div>

      <button class="btn btn-secondary mt-3" (click)="resetTheme()">
        Reset to Default
      </button>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  currentTheme: Theme = 'dark';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  resetTheme(): void {
    this.themeService.resetTheme();
  }
}
```

### Reacting to Theme Changes

Components can subscribe to theme changes to implement custom behavior:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chart',
  template: `<canvas #chartCanvas></canvas>`
})
export class ChartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.updateChartColors(theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChartColors(theme: Theme): void {
    // Update chart.js colors based on theme
    if (theme === 'dark') {
      this.chart.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.1)';
    } else {
      this.chart.options.scales.y.grid.color = 'rgba(0, 0, 0, 0.1)';
    }
    this.chart.update();
  }
}
```

---

## Advanced Usage

### Custom Theme Colors

If you need to customize theme colors beyond Bootstrap defaults:

**1. Create custom theme variables in `src/styles/themes/_custom-variables.scss`:**

```scss
// Dark theme custom colors
[data-bs-theme="dark"] {
  --app-sidebar-bg: #1a1d20;
  --app-card-shadow: rgba(0, 0, 0, 0.5);
  --app-accent-color: #4a9eff;
}

// Light theme custom colors
[data-bs-theme="light"] {
  --app-sidebar-bg: #f8f9fa;
  --app-card-shadow: rgba(0, 0, 0, 0.1);
  --app-accent-color: #0d6efd;
}
```

**2. Use custom variables in your components:**

```scss
// my-component.component.scss
.sidebar {
  background-color: var(--app-sidebar-bg);
  box-shadow: 0 2px 4px var(--app-card-shadow);
}

.accent-button {
  background-color: var(--app-accent-color);
}
```

### Synchronizing Theme Across Browser Tabs

To sync theme changes across multiple tabs (advanced use case):

```typescript
// In theme.service.ts, add BroadcastChannel support
export class ThemeService {
  private broadcastChannel?: BroadcastChannel;

  constructor() {
    // ... existing initialization ...

    // Setup cross-tab sync (if supported)
    if ('BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('theme-sync');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'theme-change') {
          this.setTheme(event.data.theme, { skipBroadcast: true });
        }
      };
    }
  }

  private broadcastThemeChange(theme: Theme): void {
    this.broadcastChannel?.postMessage({ type: 'theme-change', theme });
  }
}
```

### Integrating with System Preferences

To respect user's OS theme preference on first visit:

```typescript
// In theme.service.ts, modify getInitialTheme()
private getInitialTheme(): Theme {
  // Check for saved preference first
  const stored = this.loadPreference();
  if (stored) return stored;

  // Fall back to system preference (if desired)
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  // Default to dark (per FR-007)
  return 'dark';
}
```

**Note**: This is currently out of scope per the spec, but shown for reference.

---

## Testing

### Unit Testing ThemeService

```typescript
// theme.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should initialize with default theme', () => {
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    service.setTheme('dark');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should persist theme to localStorage', () => {
    service.setTheme('light');
    expect(localStorageMock['theme-preference']).toBe('light');
  });

  it('should load saved theme on init', () => {
    localStorageMock['theme-preference'] = 'light';
    const newService = new ThemeService();
    expect(newService.getCurrentTheme()).toBe('light');
  });
});
```

### Component Testing

```typescript
// theme-switcher.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService } from '../../../core/services/theme.service';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcherComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should display current theme', () => {
    const switchInput = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(switchInput.checked).toBe(false); // dark mode = unchecked
  });

  it('should toggle theme on click', () => {
    spyOn(themeService, 'toggleTheme');
    const switchInput = fixture.nativeElement.querySelector('input[type="checkbox"]');
    switchInput.click();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });
});
```

---

## Troubleshooting

### Theme Not Persisting

**Symptom**: Theme resets to dark on page reload.

**Causes**:
1. LocalStorage disabled (privacy mode)
2. LocalStorage quota exceeded
3. Inline script in index.html missing

**Solutions**:
1. Check browser console for storage errors
2. Verify inline script is present in `src/index.html`
3. Test in normal browser window (not incognito/private)

### FOUC (Flash of Unstyled Content)

**Symptom**: Brief flash of wrong theme on page load.

**Causes**:
1. Inline script placed after stylesheets
2. Inline script has syntax error

**Solutions**:
1. Move inline script **before** `<link>` tags
2. Check browser console for JavaScript errors

### Theme Switcher Not Visible

**Symptom**: Toggle switch doesn't appear in header.

**Causes**:
1. Component not imported in parent module/component
2. CSS display issue (z-index, overflow hidden)

**Solutions**:
1. Verify `ThemeSwitcherComponent` is in imports array
2. Inspect element in DevTools to check applied styles

### Accessibility Issues

**Symptom**: Screen reader doesn't announce theme state.

**Causes**:
1. Missing ARIA attributes
2. Browser/screen reader compatibility

**Solutions**:
1. Verify `aria-label` and `aria-checked` attributes present
2. Test with multiple screen readers (NVDA, JAWS, VoiceOver)

### Performance Issues

**Symptom**: Theme switching feels slow (>300ms).

**Causes**:
1. Large number of DOM elements
2. Complex CSS selectors
3. Slow localStorage write

**Solutions**:
1. Profile with Chrome DevTools Performance tab
2. Simplify CSS selectors for theme variables
3. Consider debouncing localStorage writes (already implemented)

---

## API Reference

### ThemeService

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getCurrentTheme()` | None | `Theme` | Get current theme synchronously |
| `toggleTheme()` | None | `void` | Toggle between dark and light |
| `setTheme(theme)` | `theme: Theme` | `void` | Set specific theme |
| `isThemeActive(theme)` | `theme: Theme` | `boolean` | Check if theme is active |
| `resetTheme()` | None | `void` | Reset to default theme |

| Property | Type | Description |
|----------|------|-------------|
| `theme$` | `Observable<Theme>` | Observable stream of current theme |

### Types

```typescript
type Theme = 'dark' | 'light';
```

---

## Next Steps

1. ✅ **Installed**: Theme switcher integrated into your app
2. 📝 **Customize**: Adjust colors in `src/styles/themes/` to match your brand
3. 🧪 **Test**: Run unit and integration tests
4. 🚀 **Deploy**: Push to production with confidence

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review the [spec.md](./spec.md) for requirements
- Consult the [data-model.md](./data-model.md) for architecture details

---

**Happy theming! 🌓**
