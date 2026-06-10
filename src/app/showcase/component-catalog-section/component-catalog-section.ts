import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { FloatingMessageShowcase } from './floating-message-showcase/floating-message-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';
import { TooltipShowcase } from './tooltip-showcase/tooltip-showcase';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AutocompleteShowcase,
    FloatingMessageShowcase,
    InputShowcase,
    MenuShowcase,
    SelectShowcase,
    TabsShowcase,
    TooltipShowcase,
    UiTab,
    UiTabItem,
  ],
  templateUrl: './component-catalog-section.html',
})
export class ComponentCatalogSection {}
