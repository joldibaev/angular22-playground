import { Component } from '@angular/core';
import { UiTab } from '../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../components/ui-tab/ui-tab-item/ui-tab-item';
import { UiTabQueryParam } from '../../components/ui-tab/ui-tab-query-param/ui-tab-query-param';
import { AlertShowcase } from './alert-showcase/alert-showcase';
import { AccordionShowcase } from './accordion-showcase/accordion-showcase';
import { AutocompleteShowcase } from './autocomplete-showcase/autocomplete-showcase';
import { AvatarShowcase } from './avatar-showcase/avatar-showcase';
import { BadgeShowcase } from './badge-showcase/badge-showcase';
import { BarcodeShowcase } from './barcode-showcase/barcode-showcase';
import { ButtonShowcase } from './button-showcase/button-showcase';
import { CardShowcase } from './card-showcase/card-showcase';
import { CheckboxShowcase } from './checkbox-showcase/checkbox-showcase';
import { ChipShowcase } from './chip-showcase/chip-showcase';
import { ContextMenuShowcase } from './context-menu-showcase/context-menu-showcase';
import { DatepickerShowcase } from './datepicker-showcase/datepicker-showcase';
import { DateRangePickerShowcase } from './date-range-picker-showcase/date-range-picker-showcase';
import { DialogShowcase } from './dialog-showcase/dialog-showcase';
import { DialogConfirmShowcase } from './dialog-confirm-showcase/dialog-confirm-showcase';
import { DialogSuccessShowcase } from './dialog-success-showcase/dialog-success-showcase';
import { DrawerShowcase } from './drawer-showcase/drawer-showcase';
import { InputShowcase } from './input-showcase/input-showcase';
import { LoadingShowcase } from './loading-showcase/loading-showcase';
import { MaskShowcase } from './mask-showcase/mask-showcase';
import { MenuShowcase } from './menu-showcase/menu-showcase';
import { NativeSelectShowcase } from './native-select-showcase/native-select-showcase';
import { PopoverShowcase } from './popover-showcase/popover-showcase';
import { ProgressShowcase } from './progress-showcase/progress-showcase';
import { RadioShowcase } from './radio-showcase/radio-showcase';
import { SelectShowcase } from './select-showcase/select-showcase';
import { SkeletonShowcase } from './skeleton-showcase/skeleton-showcase';
import { SonnerShowcase } from './sonner-showcase/sonner-showcase';
import { SwitchShowcase } from './switch-showcase/switch-showcase';
import { TableShowcase } from './table-showcase/table-showcase';
import { TabsShowcase } from './tabs-showcase/tabs-showcase';
import { TooltipShowcase } from './tooltip-showcase/tooltip-showcase';
import { TreeShowcase } from './tree-showcase/tree-showcase';
import { UiCard } from '../../components/ui-card/ui-card';
import { BrowserSupport } from '../browser-support/browser-support';

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    AccordionShowcase,
    AlertShowcase,
    AutocompleteShowcase,
    AvatarShowcase,
    BadgeShowcase,
    BarcodeShowcase,
    ButtonShowcase,
    CardShowcase,
    CheckboxShowcase,
    ChipShowcase,
    ContextMenuShowcase,
    DateRangePickerShowcase,
    DatepickerShowcase,
    DialogShowcase,
    DialogConfirmShowcase,
    DialogSuccessShowcase,
    DrawerShowcase,
    InputShowcase,
    LoadingShowcase,
    MaskShowcase,
    MenuShowcase,
    NativeSelectShowcase,
    PopoverShowcase,
    ProgressShowcase,
    RadioShowcase,
    SelectShowcase,
    SkeletonShowcase,
    SonnerShowcase,
    SwitchShowcase,
    TableShowcase,
    TabsShowcase,
    TooltipShowcase,
    TreeShowcase,
    UiTab,
    UiTabItem,
    UiTabQueryParam,
    UiCard,
    BrowserSupport,
  ],
  templateUrl: './component-catalog-section.html',
  styleUrl: './component-catalog-section.css',
})
export class ComponentCatalogSection {}
