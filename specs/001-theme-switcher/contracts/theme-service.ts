/**
 * Theme Service API Contract
 *
 * This file defines the TypeScript interfaces and types for the theme switching system.
 * It serves as the contract between the ThemeService and consuming components.
 *
 * @module ThemeServiceContract
 * @version 1.0.0
 */

/**
 * Supported theme values.
 *
 * @remarks
 * - 'dark': Low-light optimized theme (dark backgrounds, light text)
 * - 'light': Bright environment optimized theme (light backgrounds, dark text)
 *
 * @public
 */
export type Theme = 'dark' | 'light';

/**
 * Theme preference storage structure.
 *
 * @remarks
 * Currently stores only the theme value, but the interface allows
 * future expansion (e.g., timestamp, custom colors) without breaking changes.
 *
 * @public
 */
export interface ThemePreference {
  /**
   * The selected theme value.
   */
  theme: Theme;

  /**
   * ISO 8601 timestamp of when the preference was last updated.
   * Optional - reserved for future analytics/debugging use.
   */
  timestamp?: string;
}

/**
 * Configuration options for ThemeService initialization.
 *
 * @remarks
 * Allows customization of storage keys, defaults, and behavior.
 * Primarily used for testing and advanced use cases.
 *
 * @public
 */
export interface ThemeConfig {
  /**
   * LocalStorage key for storing theme preference.
   *
   * @defaultValue 'theme-preference'
   */
  storageKey: string;

  /**
   * Default theme applied when no saved preference exists.
   *
   * @defaultValue 'dark' (per FR-007)
   */
  defaultTheme: Theme;

  /**
   * Debounce delay (in milliseconds) for localStorage writes.
   * Prevents excessive writes during rapid toggling.
   *
   * @defaultValue 200
   */
  debounceMs: number;
}

/**
 * Event emitted when theme changes.
 *
 * @remarks
 * Provides enriched context for subscribers who need to track
 * theme change history or implement custom analytics.
 *
 * @public
 */
export interface ThemeChangeEvent {
  /**
   * Theme that was active before the change.
   */
  previousTheme: Theme;

  /**
   * Newly active theme after the change.
   */
  currentTheme: Theme;

  /**
   * Timestamp when the change occurred.
   */
  timestamp: Date;
}

/**
 * ThemeService public API contract.
 *
 * @remarks
 * Defines the interface that ThemeService must implement.
 * This contract ensures type safety and documents expected behavior.
 *
 * @public
 */
export interface IThemeService {
  /**
   * Observable stream of the current theme.
   *
   * @remarks
   * Emits immediately with current theme on subscription (BehaviorSubject).
   * Components can subscribe to react to theme changes.
   *
   * @example
   * ```typescript
   * constructor(private themeService: ThemeService) {
   *   this.themeService.theme$.subscribe(theme => {
   *     console.log('Current theme:', theme);
   *   });
   * }
   * ```
   */
  readonly theme$: Observable<Theme>;

  /**
   * Get the current theme value synchronously.
   *
   * @returns The currently active theme ('dark' or 'light')
   *
   * @example
   * ```typescript
   * const currentTheme = this.themeService.getCurrentTheme();
   * console.log('Current theme:', currentTheme);
   * ```
   */
  getCurrentTheme(): Theme;

  /**
   * Toggle between dark and light themes.
   *
   * @remarks
   * - dark → light
   * - light → dark
   *
   * Updates DOM, persists to localStorage, and emits new value.
   *
   * @example
   * ```typescript
   * // In component
   * onToggleClick(): void {
   *   this.themeService.toggleTheme();
   * }
   * ```
   */
  toggleTheme(): void;

  /**
   * Set a specific theme value.
   *
   * @param theme - The theme to activate ('dark' or 'light')
   *
   * @remarks
   * Use this method when you need to set a specific theme
   * rather than toggling between values.
   *
   * If the provided theme is already active, this is a no-op
   * (no DOM update, no localStorage write, no observable emission).
   *
   * @example
   * ```typescript
   * // Force dark mode
   * this.themeService.setTheme('dark');
   * ```
   */
  setTheme(theme: Theme): void;

  /**
   * Check if a specific theme is currently active.
   *
   * @param theme - The theme to check
   * @returns true if the specified theme is active, false otherwise
   *
   * @example
   * ```typescript
   * if (this.themeService.isThemeActive('dark')) {
   *   console.log('Dark mode is active');
   * }
   * ```
   */
  isThemeActive(theme: Theme): boolean;

  /**
   * Reset theme preference to default.
   *
   * @remarks
   * Removes the saved preference from localStorage and
   * reverts to the default theme ('dark' per FR-007).
   *
   * Useful for testing or "Reset to Defaults" functionality.
   *
   * @example
   * ```typescript
   * // In settings component
   * onResetToDefaults(): void {
   *   this.themeService.resetTheme();
   * }
   * ```
   */
  resetTheme(): void;
}

/**
 * Type guard to check if a value is a valid Theme.
 *
 * @param value - The value to check
 * @returns true if value is 'dark' or 'light', false otherwise
 *
 * @example
 * ```typescript
 * const stored = localStorage.getItem('theme-preference');
 * if (isValidTheme(stored)) {
 *   this.setTheme(stored); // TypeScript knows stored is Theme
 * }
 * ```
 *
 * @public
 */
export function isValidTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

/**
 * Sanitize a theme value, returning a valid Theme or fallback.
 *
 * @param value - The value to sanitize
 * @param fallback - The theme to return if value is invalid (default: 'dark')
 * @returns A valid Theme value
 *
 * @remarks
 * Handles corrupted localStorage values, undefined, null, etc.
 * Always returns a valid Theme, ensuring type safety.
 *
 * @example
 * ```typescript
 * const stored = localStorage.getItem('theme-preference');
 * const theme = sanitizeTheme(stored); // Always returns 'dark' or 'light'
 * ```
 *
 * @public
 */
export function sanitizeTheme(value: unknown, fallback: Theme = 'dark'): Theme {
  return isValidTheme(value) ? value : fallback;
}

/**
 * Constants for theme-related values.
 *
 * @public
 */
export const ThemeConstants = {
  /**
   * LocalStorage key for theme preference.
   */
  STORAGE_KEY: 'theme-preference' as const,

  /**
   * Default theme applied on first visit.
   */
  DEFAULT_THEME: 'dark' as const,

  /**
   * Debounce delay for localStorage writes (ms).
   */
  STORAGE_DEBOUNCE_MS: 200 as const,

  /**
   * HTML attribute name for theme.
   */
  DOM_ATTRIBUTE: 'data-bs-theme' as const,

  /**
   * Theme toggle animation duration (ms).
   * Note: Current spec requires instant switching (no animation).
   */
  TRANSITION_DURATION_MS: 0 as const,

  /**
   * Maximum time allowed for theme application (per FR-004).
   */
  MAX_APPLY_TIME_MS: 300 as const,
} as const;

/**
 * Error types that may be thrown by ThemeService.
 *
 * @public
 */
export enum ThemeError {
  /**
   * LocalStorage is unavailable (quota exceeded, privacy mode, etc.).
   */
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',

  /**
   * Invalid theme value provided.
   */
  INVALID_THEME = 'INVALID_THEME',

  /**
   * Theme could not be applied to DOM.
   */
  DOM_UPDATE_FAILED = 'DOM_UPDATE_FAILED',
}

/**
 * Custom error class for theme-related errors.
 *
 * @public
 */
export class ThemeServiceError extends Error {
  constructor(
    public readonly code: ThemeError,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ThemeServiceError';
  }
}

// Re-export Observable for convenience (consumers don't need rxjs import)
import { Observable } from 'rxjs';
export type { Observable };
