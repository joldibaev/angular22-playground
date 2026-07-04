import { Component, inject } from '@angular/core';
import { UiSelect } from './components/ui-select/ui-select';
import { UiSelectOption } from './components/ui-select/ui-select-option/ui-select-option';
import { type Theme, ThemeService } from './theme.service';
import { ComponentCatalogSection } from './showcase/component-catalog-section/component-catalog-section';

@Component({
  selector: 'app-root',
  imports: [
    ComponentCatalogSection,
    UiSelect,
    UiSelectOption,
  ],
  templateUrl: './app.html',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly themeOptions: { value: Theme; label: string }[] = [
    { value: 'system', label: 'Системная' },
    { value: 'dark', label: 'Тёмная' },
    { value: 'light', label: 'Светлая' },
  ];

  setTheme(value: string | string[]) {
    if (value === 'system' || value === 'dark' || value === 'light') {
      this.theme.setTheme(value);
    }
  }
}
