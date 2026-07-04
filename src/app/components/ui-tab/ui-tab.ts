import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { UiTabItem } from './ui-tab-item/ui-tab-item';
import { nextId } from '../../shared/unique-id';

export type UiTabSize = 'sm' | 'md';

@Component({
  selector: 'ui-tab',
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanel, TabContent],
  templateUrl: './ui-tab.html',
  styleUrl: './ui-tab.css',
  host: {
    '[class.ui-tab-fluid]': 'fluid()',
    '[class.ui-tab-line]': "variant() === 'line'",
    '[class.ui-tab-pills]': "variant() === 'pills'",
    '[class.ui-tab-sm]': "size() === 'sm'",
  },
})
export class UiTab {
  private readonly anchorId = nextId();
  private readonly document = inject(DOCUMENT);
  // Router is optional: the query-param sync is an opt-in feature (`queryParam`),
  // so the component must still work when used outside a routing context.
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly queryParamMap = this.route
    ? toSignal(this.route.queryParamMap, {
        initialValue: this.route.snapshot.queryParamMap,
      })
    : undefined;
  private readonly tabListInteracted = signal(false);
  private readonly userSelectedTab = signal(false);

  selectedTab = model<string | undefined>(undefined);

  selectionMode = input<'follow' | 'explicit'>('follow');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  wrap = input(true, { transform: booleanAttribute });
  softDisabled = input(true, { transform: booleanAttribute });
  preserveContent = input(true, { transform: booleanAttribute });
  queryParam = input<string>();
  variant = input<'pills' | 'line'>('pills');
  size = input<UiTabSize>('md');
  fluid = input(false, { transform: booleanAttribute });
  ariaLabel = input('', { alias: 'aria-label' });
  ariaLabelledby = input('', { alias: 'aria-labelledby' });

  readonly items = contentChildren(UiTabItem);

  readonly enabledItems = computed(() => this.items().filter((item) => !item.disabled()));
  private readonly queryParamValue = computed(() => {
    const queryParam = this.queryParam();

    return queryParam
      ? (this.queryParamMap?.().get(queryParam) ??
          new URLSearchParams(this.document.location.search).get(queryParam) ??
          undefined)
      : undefined;
  });
  readonly tabListSelectedTab = computed(() => {
    const selectedTab = this.selectedTab();
    const queryParamValue = this.queryParamValue();

    return !this.userSelectedTab() && queryParamValue && this.isEnabledTabValue(queryParamValue)
      ? queryParamValue
      : selectedTab;
  });
  readonly activeAnchorName = computed(() => {
    const selectedTab = this.tabListSelectedTab();
    const index = this.items().findIndex((item) => item.value() === selectedTab);

    return index >= 0 ? this.tabAnchorName(index) : null;
  });

  constructor() {
    afterRenderEffect(() => {
      const firstEnabledItem = this.enabledItems()[0];

      if (!firstEnabledItem) {
        return;
      }

      const queryParamValue = this.queryParamValue();

      if (queryParamValue && this.isEnabledTabValue(queryParamValue)) {
        this.selectedTab.set(queryParamValue);
        return;
      }

      if (this.selectedTab() !== undefined) {
        return;
      }

      this.selectedTab.set(firstEnabledItem.value());
    });

    afterRenderEffect(() => {
      const queryParam = this.queryParam();
      const selectedTab = this.selectedTab();
      const queryParamValue = this.queryParamValue();

      if (
        !this.router ||
        !queryParam ||
        !selectedTab ||
        !this.userSelectedTab() ||
        queryParamValue === selectedTab
      ) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [queryParam]: selectedTab },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  onSelectedTabChange(value: string | undefined) {
    if (!value || !this.tabListInteracted()) {
      return;
    }

    this.selectedTab.set(value);
    this.userSelectedTab.set(true);
  }

  onTabListInteraction() {
    this.tabListInteracted.set(true);
  }

  tabAnchorName(index: number): string {
    return `--ui-tab-${this.anchorId}-${index}`;
  }

  private isEnabledTabValue(value: string): boolean {
    return this.enabledItems().some((item) => item.value() === value);
  }
}
