import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { SupportShowcase } from './support-showcase/support-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AutocompleteShowcase,
    InputShowcase,
    MenuShowcase,
    SelectShowcase,
    SupportShowcase,
    TabsShowcase,
    UiTab,
    UiTabItem,
  ],
  templateUrl: './component-catalog-section.html',
})
export class ComponentCatalogSection {}
