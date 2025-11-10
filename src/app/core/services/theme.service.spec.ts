import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ThemeService } from './theme.service';
import { Theme, ThemeConstants } from '../models/theme.model';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default theme (dark) when no preference saved', () => {
      // Fresh service instance already created in beforeEach
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should initialize with saved preference (light)', () => {
      mockLocalStorage[ThemeConstants.STORAGE_KEY] = 'light';

      // Create new service instance
      const freshService = new ThemeService();

      expect(freshService.getCurrentTheme()).toBe('light');
    });

    it('should apply initial theme to DOM on initialization', () => {
      const setAttribute = spyOn(document.documentElement, 'setAttribute');

      // Create new service instance
      new ThemeService();

      expect(setAttribute).toHaveBeenCalledWith(ThemeConstants.DOM_ATTRIBUTE, 'dark');
    });
  });

  describe('getCurrentTheme()', () => {
    it('should return current theme synchronously', () => {
      expect(service.getCurrentTheme()).toBe('dark');
    });
  });

  describe('setTheme()', () => {
    it('should update theme from dark to light', () => {
      service.setTheme('light');

      expect(service.getCurrentTheme()).toBe('light');
    });

    it('should update theme from light to dark', () => {
      service.setTheme('light');
      service.setTheme('dark');

      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should emit new theme value via observable', (done) => {
      service.theme$.subscribe((theme: Theme) => {
        if (theme === 'light') {
          expect(theme).toBe('light');
          done();
        }
      });

      service.setTheme('light');
    });

    it('should apply theme to DOM', () => {
      const setAttribute = spyOn(document.documentElement, 'setAttribute');

      service.setTheme('light');

      expect(setAttribute).toHaveBeenCalledWith(ThemeConstants.DOM_ATTRIBUTE, 'light');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('light');

      expect(localStorage.setItem).toHaveBeenCalledWith(ThemeConstants.STORAGE_KEY, 'light');
      expect(mockLocalStorage[ThemeConstants.STORAGE_KEY]).toBe('light');
    });

    it('should be no-op if theme is already active', () => {
      const currentTheme = service.getCurrentTheme();
      const setItemCallCount = (localStorage.setItem as jasmine.Spy).calls.count();

      service.setTheme(currentTheme);

      // Should not call localStorage.setItem again
      expect((localStorage.setItem as jasmine.Spy).calls.count()).toBe(setItemCallCount);
    });

    it('should handle localStorage unavailable gracefully', () => {
      (localStorage.setItem as jasmine.Spy).and.throwError('QuotaExceededError');
      const consoleWarn = spyOn(console, 'warn');

      // Should not throw error
      expect(() => service.setTheme('light')).not.toThrow();
      expect(consoleWarn).toHaveBeenCalled();

      // Theme should still work in-memory
      expect(service.getCurrentTheme()).toBe('light');
    });
  });

  describe('toggleTheme()', () => {
    it('should toggle from dark to light', () => {
      expect(service.getCurrentTheme()).toBe('dark');

      service.toggleTheme();

      expect(service.getCurrentTheme()).toBe('light');
    });

    it('should toggle from light to dark', () => {
      service.setTheme('light');

      service.toggleTheme();

      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should toggle multiple times correctly', () => {
      expect(service.getCurrentTheme()).toBe('dark');

      service.toggleTheme(); // dark -> light
      expect(service.getCurrentTheme()).toBe('light');

      service.toggleTheme(); // light -> dark
      expect(service.getCurrentTheme()).toBe('dark');

      service.toggleTheme(); // dark -> light
      expect(service.getCurrentTheme()).toBe('light');
    });
  });

  describe('isThemeActive()', () => {
    it('should return true for active theme', () => {
      service.setTheme('dark');

      expect(service.isThemeActive('dark')).toBe(true);
    });

    it('should return false for inactive theme', () => {
      service.setTheme('dark');

      expect(service.isThemeActive('light')).toBe(false);
    });
  });

  describe('resetTheme()', () => {
    it('should remove preference from localStorage', () => {
      service.setTheme('light');

      service.resetTheme();

      expect(localStorage.removeItem).toHaveBeenCalledWith(ThemeConstants.STORAGE_KEY);
    });

    it('should revert to default theme (dark)', () => {
      service.setTheme('light');

      service.resetTheme();

      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should handle localStorage unavailable gracefully', () => {
      (localStorage.removeItem as jasmine.Spy).and.throwError('SecurityError');
      const consoleWarn = spyOn(console, 'warn');

      // Should not throw error
      expect(() => service.resetTheme()).not.toThrow();
      expect(consoleWarn).toHaveBeenCalled();

      // Theme should still reset
      expect(service.getCurrentTheme()).toBe('dark');
    });
  });

  describe('localStorage error handling', () => {
    it('should handle corrupted theme value in localStorage', () => {
      mockLocalStorage[ThemeConstants.STORAGE_KEY] = 'invalid-theme';

      const freshService = new ThemeService();

      // Should sanitize to default
      expect(freshService.getCurrentTheme()).toBe('dark');
    });

    it('should handle localStorage getItem throwing error', () => {
      (localStorage.getItem as jasmine.Spy).and.throwError('SecurityError');
      const consoleWarn = spyOn(console, 'warn');

      const freshService = new ThemeService();

      expect(consoleWarn).toHaveBeenCalled();
      // Should fallback to default
      expect(freshService.getCurrentTheme()).toBe('dark');
    });
  });

  describe('Observable behavior', () => {
    it('should emit current theme immediately on subscription (BehaviorSubject)', (done) => {
      service.setTheme('light');

      service.theme$.subscribe((theme: Theme) => {
        expect(theme).toBe('light');
        done();
      });
    });

    it('should emit new values to all subscribers', () => {
      const subscriber1Values: Theme[] = [];
      const subscriber2Values: Theme[] = [];

      service.theme$.subscribe((theme: Theme) => subscriber1Values.push(theme));
      service.theme$.subscribe((theme: Theme) => subscriber2Values.push(theme));

      service.setTheme('light');
      service.setTheme('dark');

      // Both subscribers should receive all updates (including initial value)
      expect(subscriber1Values).toEqual(['dark', 'light', 'dark']);
      expect(subscriber2Values).toEqual(['dark', 'light', 'dark']);
    });
  });

  describe('DOM manipulation', () => {
    it('should handle DOM setAttribute errors gracefully', () => {
      const consoleError = spyOn(console, 'error');
      spyOn(document.documentElement, 'setAttribute').and.throwError('DOM Error');

      // Should not throw
      expect(() => service.setTheme('light')).not.toThrow();
      expect(consoleError).toHaveBeenCalled();
    });
  });
});
