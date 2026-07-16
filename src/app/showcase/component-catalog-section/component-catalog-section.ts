import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal, type Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UiButton } from '../../components/ui-button/ui-button';
import { UiCard } from '../../components/ui-card/ui-card';
import { UiDrawer } from '../../components/ui-drawer/ui-drawer';
import { UiDrawerClose } from '../../components/ui-drawer/ui-drawer-close/ui-drawer-close';
import { UiDrawerTrigger } from '../../components/ui-drawer/ui-drawer-trigger/ui-drawer-trigger';
import { UiIcon } from '../../components/ui-icon/ui-icon';
import { UiInput } from '../../components/ui-input/ui-input';
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
import { ConfirmPopupShowcase } from './confirm-popup-showcase/confirm-popup-showcase';
import { ContextMenuShowcase } from './context-menu-showcase/context-menu-showcase';
import { DatepickerShowcase } from './datepicker-showcase/datepicker-showcase';
import { DateRangePickerShowcase } from './date-range-picker-showcase/date-range-picker-showcase';
import { DescriptionListShowcase } from './description-list-showcase/description-list-showcase';
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
import {
  BrowserSupport,
  type BrowserSupportProfile,
} from '../browser-support/browser-support';

interface CatalogItem {
  readonly value: BrowserSupportProfile;
  readonly label: string;
  readonly component: Type<unknown>;
}

interface CatalogGroup {
  readonly label: string;
  readonly items: readonly CatalogItem[];
}

@Component({
  selector: 'app-component-catalog-section',
  imports: [
    BrowserSupport,
    NgComponentOutlet,
    UiButton,
    UiCard,
    UiDrawer,
    UiDrawerClose,
    UiDrawerTrigger,
    UiIcon,
    UiInput,
  ],
  templateUrl: './component-catalog-section.html',
  styleUrl: './component-catalog-section.css',
})
export class ComponentCatalogSection {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly filter = signal('');
  // One registry drives navigation, URL validation, support metadata, and the
  // rendered showcase so a new catalog entry cannot drift between four lists.
  readonly groups: readonly CatalogGroup[] = [
    {
      label: 'Основные',
      items: [
        { value: 'accordion', label: 'Accordion', component: AccordionShowcase },
        { value: 'button', label: 'Button', component: ButtonShowcase },
        { value: 'card', label: 'Card', component: CardShowcase },
        { value: 'loading', label: 'Loading', component: LoadingShowcase },
        { value: 'progress', label: 'Progress', component: ProgressShowcase },
        { value: 'skeleton', label: 'Skeleton', component: SkeletonShowcase },
      ],
    },
    {
      label: 'Отображение данных',
      items: [
        { value: 'avatar', label: 'Avatar', component: AvatarShowcase },
        { value: 'badge', label: 'Badge', component: BadgeShowcase },
        { value: 'barcode', label: 'Barcode', component: BarcodeShowcase },
        { value: 'chip', label: 'Chip', component: ChipShowcase },
        {
          value: 'description-list',
          label: 'Description list',
          component: DescriptionListShowcase,
        },
        { value: 'table', label: 'Table', component: TableShowcase },
        { value: 'tree', label: 'Tree', component: TreeShowcase },
      ],
    },
    {
      label: 'Формы',
      items: [
        { value: 'autocomplete', label: 'Autocomplete', component: AutocompleteShowcase },
        { value: 'checkbox', label: 'Checkbox', component: CheckboxShowcase },
        { value: 'datepicker', label: 'Datepicker', component: DatepickerShowcase },
        {
          value: 'date-range-picker',
          label: 'Date range picker',
          component: DateRangePickerShowcase,
        },
        { value: 'input', label: 'Input', component: InputShowcase },
        { value: 'mask', label: 'Mask', component: MaskShowcase },
        { value: 'native-select', label: 'Native select', component: NativeSelectShowcase },
        { value: 'radio', label: 'Radio', component: RadioShowcase },
        { value: 'select', label: 'Select', component: SelectShowcase },
        { value: 'switch', label: 'Switch', component: SwitchShowcase },
      ],
    },
    {
      label: 'Навигация',
      items: [
        { value: 'context-menu', label: 'Context menu', component: ContextMenuShowcase },
        { value: 'menu', label: 'Menu', component: MenuShowcase },
        { value: 'tabs', label: 'Tabs', component: TabsShowcase },
      ],
    },
    {
      label: 'Оверлеи',
      items: [
        { value: 'dialog', label: 'Dialog', component: DialogShowcase },
        {
          value: 'dialog-confirm',
          label: 'Dialog confirm',
          component: DialogConfirmShowcase,
        },
        {
          value: 'dialog-success',
          label: 'Dialog success',
          component: DialogSuccessShowcase,
        },
        {
          value: 'confirm-popup',
          label: 'Confirm popup',
          component: ConfirmPopupShowcase,
        },
        { value: 'drawer', label: 'Drawer', component: DrawerShowcase },
        { value: 'popover', label: 'Popover', component: PopoverShowcase },
        { value: 'tooltip', label: 'Tooltip', component: TooltipShowcase },
      ],
    },
    {
      label: 'Обратная связь',
      items: [
        { value: 'alert', label: 'Alert', component: AlertShowcase },
        { value: 'sonner', label: 'Sonner', component: SonnerShowcase },
      ],
    },
  ];

  readonly items = this.groups.flatMap((group) => group.items);
  readonly activeItem = computed(() => {
    const routeValue = this.queryParamMap().get('component');
    return this.items.find((item) => item.value === routeValue) ?? this.items[0];
  });
  readonly filteredGroups = computed(() => {
    const query = this.filter().trim().toLocaleLowerCase();

    if (!query) {
      return this.groups;
    }

    return this.groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLocaleLowerCase().includes(query)),
      }))
      .filter((group) => group.items.length > 0);
  });

  selectComponent(value: string): void {
    if (value === this.activeItem().value) {
      return;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { component: value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
