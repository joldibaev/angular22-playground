import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { AvatarShowcase } from './avatar-showcase/avatar-showcase';
import { BadgeShowcase } from './badge-showcase/badge-showcase';
import { ButtonShowcase } from './button-showcase/button-showcase';
import { CardShowcase } from './card-showcase/card-showcase';
import { CheckboxShowcase } from './checkbox-showcase/checkbox-showcase';
import { ChipShowcase } from './chip-showcase/chip-showcase';
import { DatepickerShowcase } from './datepicker-showcase/datepicker-showcase';
import { DialogShowcase } from './dialog-showcase/dialog-showcase';
import { DrawerShowcase } from './drawer-showcase/drawer-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { PopoverShowcase } from './popover-showcase/popover-showcase';
import { RadioShowcase } from './radio-showcase/radio-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { SonnerShowcase } from './sonner-showcase/sonner-showcase';
import { SwitchShowcase } from './switch-showcase/switch-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';
import { TooltipShowcase } from './tooltip-showcase/tooltip-showcase';
import { TreeShowcase } from './tree-showcase/tree-showcase';
import { UiCard } from '../../components/ui-card/ui-card';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AutocompleteShowcase,
    AvatarShowcase,
    BadgeShowcase,
    ButtonShowcase,
    CardShowcase,
    CheckboxShowcase,
    ChipShowcase,
    DatepickerShowcase,
    DialogShowcase,
    DrawerShowcase,
    InputShowcase,
    MenuShowcase,
    PopoverShowcase,
    RadioShowcase,
    SelectShowcase,
    SonnerShowcase,
    SwitchShowcase,
    TabsShowcase,
    TooltipShowcase,
    TreeShowcase,
    UiTab,
    UiTabItem,
    UiCard,
  ],
  templateUrl: './component-catalog-section.html',
})
export class ComponentCatalogSection {}
