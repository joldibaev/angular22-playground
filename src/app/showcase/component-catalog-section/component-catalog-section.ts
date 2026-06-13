import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { CardShowcase } from './card-showcase/card-showcase';
import { FloatingContentShowcase } from './floating-content-showcase/floating-content-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';
import { TooltipShowcase } from './tooltip-showcase/tooltip-showcase';
import { UiCard } from '../../components/ui-card/ui-card';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AutocompleteShowcase,
    CardShowcase,
    FloatingContentShowcase,
    InputShowcase,
    MenuShowcase,
    SelectShowcase,
    TabsShowcase,
    TooltipShowcase,
    UiTab,
    UiTabItem,
    UiCard,
  ],
  templateUrl: './component-catalog-section.html',
})
export class ComponentCatalogSection {}
