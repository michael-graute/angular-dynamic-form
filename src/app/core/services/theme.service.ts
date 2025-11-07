import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme, ThemeConstants, sanitizeTheme } from '../models/theme.model';

/**
 * ThemeService - Manages application theme state and persistence.
 *
 * @remarks
 * Provides centralized theme management with localStorage persistence,
 * graceful degradation, and reactive state updates via RxJS.
 *
 * @public
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = ThemeConstants.STORAGE_KEY;
  private readonly DEFAULT_THEME = ThemeConstants.DEFAULT_THEME;

  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor() {
    // T007: Initialize with saved preference or default
    const initialTheme = this.getInitialTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();

    // Apply initial theme to DOM
    this.applyThemeToDom(initialTheme);
  }

  /**
   * Get the current theme value synchronously.
   *
   * @returns The currently active theme
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Set a specific theme value.
   *
   * @param theme - The theme to activate ('dark' or 'light')
   * @remarks
   * If the provided theme is already active, this is a no-op.
   * Updates DOM, persists to localStorage, and emits new value.
   */
  setTheme(theme: Theme): void {
    // Skip if already active
    if (this.themeSubject.value === theme) {
      return;
    }

    // Update reactive state
    this.themeSubject.next(theme);

    // Update DOM (T024)
    this.applyThemeToDom(theme);

    // Persist to storage (T008)
    this.savePreference(theme);
  }

  /**
   * Toggle between dark and light themes.
   *
   * @remarks
   * - dark → light
   * - light → dark
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Check if a specific theme is currently active.
   *
   * @param theme - The theme to check
   * @returns true if the specified theme is active, false otherwise
   */
  isThemeActive(theme: Theme): boolean {
    return this.getCurrentTheme() === theme;
  }

  /**
   * Reset theme preference to default.
   *
   * @remarks
   * Removes the saved preference from localStorage and
   * reverts to the default theme ('dark' per FR-007).
   */
  resetTheme(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      // Storage unavailable - no action needed
      console.warn('Unable to clear theme preference:', error);
    }
    this.setTheme(this.DEFAULT_THEME);
  }

  /**
   * T008: Load saved theme preference from localStorage.
   *
   * @returns Saved theme or null if unavailable
   * @private
   */
  private loadPreference(): Theme | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        // T009: Sanitize to handle corrupted values
        return sanitizeTheme(stored, this.DEFAULT_THEME);
      }
      return null;
    } catch (error) {
      // T008: LocalStorage unavailable (privacy mode, quota exceeded)
      console.warn('Unable to load theme preference:', error);
      return null;
    }
  }

  /**
   * T008: Save theme preference to localStorage.
   *
   * @param theme - The theme to persist
   * @private
   */
  private savePreference(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      // T008: Graceful degradation - theme still works in-memory (FR-005a)
      console.warn('Unable to persist theme preference:', error);
    }
  }

  /**
   * T009: Get initial theme (from storage or default).
   *
   * @returns Theme to initialize with
   * @private
   */
  private getInitialTheme(): Theme {
    const savedTheme = this.loadPreference();
    return savedTheme !== null ? savedTheme : this.DEFAULT_THEME;
  }

  /**
   * T024: Apply theme to DOM via data-bs-theme attribute.
   *
   * @param theme - The theme to apply
   * @private
   */
  private applyThemeToDom(theme: Theme): void {
    try {
      document.documentElement.setAttribute(ThemeConstants.DOM_ATTRIBUTE, theme);
    } catch (error) {
      console.error('Failed to apply theme to DOM:', error);
    }
  }
}
