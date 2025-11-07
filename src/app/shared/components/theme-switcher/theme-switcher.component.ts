import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.model';

/**
 * ThemeSwitcherComponent - Toggle switch control for dark/light theme switching
 *
 * @remarks
 * Provides a Bootstrap form-switch UI for toggling between themes.
 * Automatically syncs with ThemeService state changes.
 *
 * @public
 */
@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'dark';
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // T021: Subscribe to theme$ observable for reactive updates
    this.themeSubscription = this.themeService.theme$.subscribe((theme: Theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Handle toggle switch click event
   */
  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Computed property for template binding
   * Returns true if light theme is active (checkbox checked state)
   */
  get isLightTheme(): boolean {
    return this.currentTheme === 'light';
  }
}
