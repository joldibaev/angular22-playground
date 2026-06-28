import { Component, inject } from '@angular/core';
import { UiButton } from './components/ui-button/ui-button';
import { type Theme, ThemeService } from './theme.service';
import { ComponentCatalogSection } from './showcase/component-catalog-section/component-catalog-section';

@Component({
  selector: 'app-root',
  imports: [ComponentCatalogSection, UiButton],
  templateUrl: './app.html',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly themeOptions: {
    value: Theme;
    label: string;
  }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  setTheme(value: Theme) {
    this.theme.setTheme(value);
  }
}
