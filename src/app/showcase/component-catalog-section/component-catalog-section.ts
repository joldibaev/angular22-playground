import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { ButtonShowcase } from './button-showcase/button-showcase';
import { CardShowcase } from './card-showcase/card-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { PopoverShowcase } from './popover-showcase/popover-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';
import { TooltipShowcase } from './tooltip-showcase/tooltip-showcase';
import { UiCard } from '../../components/ui-card/ui-card';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AutocompleteShowcase,
    ButtonShowcase,
    CardShowcase,
    InputShowcase,
    MenuShowcase,
    PopoverShowcase,
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
