import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type Theme = 'system' | 'light' | 'dark';

const themeStorageKey = 'angular22-theme';

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      const theme = this.theme();

      if (theme === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', theme);
      }

      localStorage.setItem(themeStorageKey, theme);
    });
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    const storedTheme = localStorage.getItem(themeStorageKey);
    return storedTheme === 'system' || storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : 'system';
  }
}
