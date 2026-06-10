import { Component, inject } from '@angular/core';
import { UiSegmented } from './components/ui-segmented/ui-segmented';
import { UiSegmentedItem } from './components/ui-segmented/ui-segmented-item/ui-segmented-item';
import { type Theme, ThemeService } from './theme.service';
import { ComponentCatalogSection } from './showcase/component-catalog-section/component-catalog-section';

@Component({
  selector: 'app-root',
  imports: [
    UiSegmented,
    UiSegmentedItem,
    ComponentCatalogSection,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly themeOptions: {
    value: Theme;
    label: string;
  }[] = [
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];
}
