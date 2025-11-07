# Tasks: Dark/Light Mode Switcher

**Input**: Design documents from `/specs/001-theme-switcher/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-service.ts

**Tests**: Test tasks included per Jasmine 5.12.1 testing requirement

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-project Angular application structure:
- Source code: `src/app/`
- Styles: `src/styles/`
- Tests: `src/app/**/*.spec.ts` (co-located with source files)
- Main HTML: `src/index.html`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and model definitions that all user stories depend on

- [X] T001 Create core services directory structure at `src/app/core/services/`
- [X] T002 Create core models directory structure at `src/app/core/models/`
- [X] T003 Create shared components directory structure at `src/app/shared/components/theme-switcher/`
- [X] T004 Create theme styles directory structure at `src/styles/themes/`
- [X] T005 [P] Create Theme type definitions in `src/app/core/models/theme.model.ts`
- [X] T006 [P] Create ThemeService interface contract based on `contracts/theme-service.ts` in `src/app/core/services/theme.service.ts` (skeleton only, no implementation)

**Checkpoint**: Directory structure and type definitions ready for user story implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Implement ThemeService core logic in `src/app/core/services/theme.service.ts` - BehaviorSubject, theme state management, getCurrentTheme(), setTheme() methods
- [X] T008 Implement localStorage integration in ThemeService - savePreference(), loadPreference() with error handling for quota exceeded/disabled storage
- [X] T009 Implement theme sanitization and validation utilities in ThemeService - isValidTheme(), sanitizeTheme() functions
- [X] T010 Create light theme color variables in `src/styles/themes/_light.scss` with WCAG AA compliant colors
- [X] T011 [P] Create dark theme color variables in `src/styles/themes/_dark.scss` with WCAG AA compliant colors
- [X] T012 Create theme CSS custom properties in `src/styles/themes/_theme-variables.scss` defining shared variables for both themes
- [X] T013 Update `src/styles.scss` to import theme files (_theme-variables.scss, _light.scss, _dark.scss) with proper Bootstrap integration
- [X] T014 Add FOUC prevention inline script to `src/index.html` before stylesheet links - reads localStorage and sets data-bs-theme attribute synchronously
- [X] T015 Write unit tests for ThemeService in `src/app/core/services/theme.service.spec.ts` - test toggleTheme(), setTheme(), getCurrentTheme(), localStorage interactions with mocks

**Checkpoint**: Foundation ready - theme service and styles functional, user story implementation can now begin

---

## Phase 3: User Story 1 - Toggle Between Themes (Priority: P1) 🎯 MVP

**Goal**: Users can click a toggle switch control to switch between dark and light themes, with all UI elements updating instantly

**Independent Test**: Open application in dark mode, click theme switcher, verify entire interface switches to light mode with appropriate colors. Click again, verify switch back to dark mode.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US1] Create component test file `src/app/shared/components/theme-switcher/theme-switcher.component.spec.ts` with initial describe block
- [X] T017 [P] [US1] Write test: "should display toggle switch control" in theme-switcher.component.spec.ts
- [X] T018 [P] [US1] Write test: "should call ThemeService.toggleTheme() when switch clicked" in theme-switcher.component.spec.ts
- [X] T019 [P] [US1] Write test: "should update switch state when theme changes" in theme-switcher.component.spec.ts
- [X] T020 [P] [US1] Write integration test: "should update DOM data-bs-theme attribute when toggled" in theme.service.spec.ts

### Implementation for User Story 1

- [X] T021 [US1] Create ThemeSwitcherComponent TypeScript class in `src/app/shared/components/theme-switcher/theme-switcher.component.ts` - inject ThemeService, create toggleTheme() method, subscribe to theme$ observable
- [X] T022 [US1] Create ThemeSwitcherComponent template in `src/app/shared/components/theme-switcher/theme-switcher.component.html` - Bootstrap form-switch with dark/light labels, wire click event to toggleTheme()
- [X] T023 [US1] Create ThemeSwitcherComponent styles in `src/app/shared/components/theme-switcher/theme-switcher.component.scss` - style toggle switch labels, positioning
- [X] T024 [US1] Implement DOM manipulation in ThemeService.setTheme() - update document.documentElement.setAttribute('data-bs-theme', theme)
- [X] T025 [US1] Implement ThemeService.toggleTheme() method - determine opposite theme, call setTheme(), emit new value via BehaviorSubject
- [X] T026 [US1] Update `src/app/app.component.html` to add theme-switcher component to header/navigation bar (top-right position)
- [X] T027 [US1] Update `src/app/app.component.ts` imports to include ThemeSwitcherComponent
- [X] T028 [US1] Verify theme application to existing Bootstrap components - test forms, buttons, cards update colors correctly
- [X] T029 [US1] Run all tests for User Story 1, fix any failures

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can toggle themes and see instant visual changes

---

## Phase 4: User Story 2 - Persist Theme Preference (Priority: P2)

**Goal**: User's theme choice is remembered across browser sessions via localStorage persistence

**Independent Test**: Select light mode, close browser, reopen application, verify light mode is still active. Test with dark mode. Test first-time user defaults to dark mode.

### Tests for User Story 2

- [X] T030 [P] [US2] Write test: "should persist theme to localStorage when setTheme() called" in theme.service.spec.ts
- [X] T031 [P] [US2] Write test: "should load saved theme on service initialization" in theme.service.spec.ts
- [X] T032 [P] [US2] Write test: "should default to dark theme for first-time users" in theme.service.spec.ts
- [X] T033 [P] [US2] Write test: "should handle localStorage unavailable gracefully" in theme.service.spec.ts

### Implementation for User Story 2

- [X] T034 [US2] Implement ThemeService.savePreference() method with try/catch for QuotaExceededError and SecurityError
- [X] T035 [US2] Implement ThemeService.loadPreference() method with sanitizeTheme() call for corrupted values
- [X] T036 [US2] Implement ThemeService.getInitialTheme() method - check localStorage first, fall back to default 'dark'
- [X] T037 [US2] Update ThemeService constructor to call getInitialTheme() for BehaviorSubject initialization
- [X] T038 [US2] Wire setTheme() to call savePreference() after updating state (with debouncing if needed)
- [X] T039 [US2] Verify inline script in `src/index.html` correctly loads saved preference before Angular bootstrap
- [X] T040 [US2] Test persistence: Save theme, reload page, verify theme restored correctly
- [X] T041 [US2] Test graceful degradation: Simulate localStorage disabled (privacy mode), verify theme still switches in-memory
- [X] T042 [US2] Run all tests for User Story 2, fix any failures

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - theme persists across sessions

---

## Phase 5: User Story 3 - Accessible Theme Switcher (Priority: P3)

**Goal**: Theme switcher is fully operable via keyboard navigation and announces state changes to screen readers

**Independent Test**: Use keyboard only (Tab to navigate, Space/Enter to toggle), verify switcher receives focus, toggles work, focus indicator visible. Use screen reader, verify theme state announced.

### Tests for User Story 3

- [X] T043 [P] [US3] Write test: "should have proper ARIA attributes" in theme-switcher.component.spec.ts
- [X] T044 [P] [US3] Write test: "should be keyboard accessible (Space/Enter triggers toggle)" in theme-switcher.component.spec.ts
- [X] T045 [P] [US3] Write test: "should have visible focus indicator" in theme-switcher.component.spec.ts
- [X] T046 [P] [US3] Write test: "should update aria-checked when theme changes" in theme-switcher.component.spec.ts

### Implementation for User Story 3

- [X] T047 [P] [US3] Add ARIA attributes to toggle switch in `theme-switcher.component.html` - aria-label="Toggle theme", role="switch", aria-checked binding
- [X] T048 [P] [US3] Add keyboard event handlers to toggle switch - keydown.space and keydown.enter call toggleTheme()
- [X] T049 [P] [US3] Add focus-visible styles in `theme-switcher.component.scss` - prominent outline, high contrast focus indicator
- [X] T050 [P] [US3] Add screen reader announcements - ensure aria-checked updates reactively with theme changes
- [X] T051 [US3] Test keyboard navigation: Tab to switcher, verify focus visible, press Space, verify theme toggles
- [X] T052 [US3] Test screen reader (manual): Verify "Dark mode, toggle switch, checked/unchecked" announcement
- [X] T053 [US3] Verify WCAG AA contrast ratios for toggle switch labels in both themes (4.5:1 minimum for normal text)
- [X] T054 [US3] Run all tests for User Story 3, fix any failures

**Checkpoint**: All user stories should now be independently functional - theme switcher is fully accessible

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, performance validation, documentation, and edge case handling

- [X] T055 [P] Add debouncing to localStorage writes in ThemeService - use RxJS debounceTime(200) to prevent excessive writes during rapid toggling
- [X] T056 [P] Verify theme corruption fallback - manually corrupt localStorage value, verify app defaults to dark mode and doesn't break
- [X] T057 [P] Verify theme switching during operations - start form submission, toggle theme mid-submission, verify no interruption (per FR-012)
- [X] T058 Test performance: Measure theme switch time with Chrome DevTools, verify <300ms total (DOM update + CSS reflow)
- [X] T059 [P] Add console warning when localStorage write fails (for debugging)
- [X] T060 [P] Verify no FOUC on page load - test with network throttling, verify correct theme loads before CSS renders
- [X] T061 Run full test suite: `npm test` - verify all 30+ unit and integration tests pass
- [X] T062 Run lint: `npm run lint` - fix any TypeScript or style errors
- [X] T063 Manual browser testing: Test in Chrome, Firefox, Safari, Edge (latest versions) - verify theme switching works consistently
- [X] T064 Accessibility audit: Run axe DevTools or Lighthouse accessibility report, verify no violations
- [X] T065 Update CLAUDE.md if needed with any theme-specific development patterns or gotchas

**Checkpoint**: Feature complete, tested, performant, and production-ready

---

## Dependencies & Execution Strategy

### User Story Dependencies

```
Phase 1 (Setup) ──→ Phase 2 (Foundation)
                            │
                            ├──→ Phase 3 (US1: Toggle) 🎯 MVP
                            │         │
                            ├──→ Phase 4 (US2: Persist)
                            │         ↓
                            └──→ Phase 5 (US3: Accessibility)
                                      ↓
                                 Phase 6 (Polish)
```

**Key Insights**:
- **US1 is the MVP**: Delivers core theme switching functionality
- **US2 and US3 are independent**: Can be implemented in parallel after US1
- **US2 depends on US1**: Persistence requires working theme toggle
- **US3 depends on US1**: Accessibility enhancements require working toggle component
- **Foundation is blocking**: ThemeService and styles MUST be complete before any user story

### Parallel Execution Opportunities

**Phase 1 (Setup)**: Tasks T005-T006 can run in parallel (different files)

**Phase 2 (Foundation)**:
- T010-T012 can run in parallel (different SCSS files)
- T015 (tests) can be written in parallel with T007-T014 implementations

**Phase 3 (US1 Tests)**: T016-T020 can run in parallel (different test files/suites)

**Phase 3 (US1 Implementation)**: T021-T023 can run in parallel (component class, template, styles are independent until integration)

**Phase 4 (US2 Tests)**: T030-T033 can run in parallel

**Phase 5 (US3 Tests)**: T043-T046 can run in parallel

**Phase 5 (US3 Implementation)**: T047-T050 can run in parallel (ARIA, keyboard, focus styles are independent concerns)

**Phase 6 (Polish)**: T055-T057, T059-T060 can run in parallel

### MVP Delivery Strategy

**Minimum Viable Product (MVP)** = Phase 1 + Phase 2 + Phase 3 (User Story 1)

**MVP Scope**:
- ✅ Theme service with dark/light themes
- ✅ Toggle switch in header
- ✅ Instant visual updates (<300ms)
- ✅ WCAG AA compliant colors
- ❌ Persistence (added in Phase 4)
- ❌ Advanced accessibility (added in Phase 5)

**Incremental Delivery**:
1. **Sprint 1**: Deliver MVP (US1) - ~29 tasks
2. **Sprint 2**: Add persistence (US2) - ~13 tasks
3. **Sprint 3**: Add accessibility (US3) - ~12 tasks
4. **Sprint 4**: Polish and production hardening - ~11 tasks

**Total**: 65 tasks organized into 6 phases

---

## Testing Strategy

### Test Distribution

| Phase | Unit Tests | Integration Tests | Manual Tests | Total |
|-------|------------|-------------------|--------------|-------|
| Foundation (Phase 2) | 1 task (T015) | - | - | 1 |
| US1 (Phase 3) | 4 tasks | 1 task | 1 task (T028) | 6 |
| US2 (Phase 4) | 4 tasks | - | 2 tasks (T040-T041) | 6 |
| US3 (Phase 5) | 4 tasks | - | 2 tasks (T051-T052) | 6 |
| Polish (Phase 6) | - | 1 task (T061) | 5 tasks | 6 |
| **Total** | **13 unit** | **2 integration** | **10 manual** | **25** |

### Test Coverage Goals

- **ThemeService**: 100% code coverage (all methods, error paths, localStorage interactions)
- **ThemeSwitcherComponent**: 100% code coverage (toggle, state updates, event handling)
- **Integration**: Theme persistence, DOM updates, cross-component consistency
- **Accessibility**: Keyboard navigation, screen reader announcements, WCAG compliance
- **Performance**: <300ms theme switch time (FR-004)
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## Acceptance Criteria Summary

### User Story 1 Acceptance Criteria ✅
1. Application displays toggle switch in header/navigation bar
2. Toggle switch has visible dark/light labels
3. Clicking toggle switches from dark → light → dark
4. All UI elements (forms, buttons, text, backgrounds) update colors instantly
5. Theme change completes within 300ms
6. Text maintains 4.5:1 contrast ratio (normal) and 3:1 (large) in both themes

### User Story 2 Acceptance Criteria ✅
1. Selected theme persists when closing and reopening browser
2. Dark mode persisted → loads as dark on return
3. Light mode persisted → loads as light on return
4. First-time users default to dark mode
5. When localStorage unavailable, theme switching still works (no persistence)
6. Inline script prevents FOUC (Flash of Unstyled Content)

### User Story 3 Acceptance Criteria ✅
1. Tab key navigates to theme switcher, visible focus indicator shown
2. Space or Enter key toggles theme when switcher has focus
3. Screen reader announces "Dark mode, toggle switch, checked" (or unchecked)
4. Theme switcher has aria-label="Toggle theme" and aria-checked attribute
5. Focus indicator meets WCAG AA contrast requirements
6. No accessibility violations in axe DevTools / Lighthouse audit

---

## Implementation Notes

### Key Technical Decisions (from research.md)

1. **CSS Strategy**: Use Bootstrap 5.3 `data-bs-theme` attribute + CSS custom properties
2. **State Management**: Angular service + RxJS BehaviorSubject
3. **Storage**: LocalStorage with graceful degradation (continue working if unavailable)
4. **UI Component**: Bootstrap form-switch (native checkbox semantics for accessibility)
5. **FOUC Prevention**: Inline script in index.html loads theme before CSS renders
6. **Performance**: Debounce localStorage writes, O(1) theme switching via CSS variables

### File Structure Reference (from plan.md)

```
src/app/
├── core/
│   ├── services/
│   │   └── theme.service.ts (+ .spec.ts)
│   └── models/
│       └── theme.model.ts
├── shared/
│   └── components/
│       └── theme-switcher/
│           ├── theme-switcher.component.ts
│           ├── theme-switcher.component.html
│           ├── theme-switcher.component.scss
│           └── theme-switcher.component.spec.ts
└── app.component.ts (updated)

src/styles/
├── themes/
│   ├── _dark.scss
│   ├── _light.scss
│   └── _theme-variables.scss
└── styles.scss (updated)

src/index.html (updated with inline script)
```

### Constitution Compliance ✅

All tasks align with project constitution:
- **Principle I (JSON-First)**: ✅ Theme is infrastructure, not form config
- **Principle II (Component-Based)**: ✅ Standalone component + service architecture
- **Principle III (Validation-First)**: ✅ N/A (presentation layer only)
- **Principle IV (Developer Experience)**: ✅ Simple API, comprehensive tests
- **Principle V (Performance)**: ✅ O(1) switching, <300ms target

---

## Ready for Implementation

All 65 tasks are now defined with:
- ✅ Sequential task IDs (T001-T065)
- ✅ Parallel execution markers [P]
- ✅ User story labels [US1], [US2], [US3]
- ✅ Exact file paths
- ✅ Clear dependencies
- ✅ Independent test criteria per story
- ✅ MVP scope identified (Phase 1-3)

**Next Command**: `/speckit.implement` to begin execution, or `/speckit.analyze` to validate cross-artifact consistency first.
