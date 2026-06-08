import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  type ProviderToken,
} from '@angular/core';
import { UiSegmentedItem } from './ui-segmented-item/ui-segmented-item';

@Component({
  selector: 'ui-segmented',
  template: `
    <ng-content />
    <span class="ui-segmented-indicator" aria-hidden="true"></span>
  `,
  host: {
    class: 'ui-segmented-list',
    '[class.ui-segmented-list-pills]': "appearance() === 'pills'",
    '[class.ui-segmented-list-line]': "appearance() === 'line'",
    '[class.ui-segmented-list-fluid]': 'fluid()',
    '[class.ui-segmented-list-elevated]': 'elevated()',
    '[attr.role]': 'selection() === "single" ? "radiogroup" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiSegmented {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly appearance = input<'pills' | 'line'>('pills');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly elevated = input(true, { transform: booleanAttribute });
  readonly selection = input<'single' | 'none'>('single');
  readonly ariaLabel = input('', { alias: 'aria-label' });
  readonly value = model<string | undefined>(undefined);

  readonly items = contentChildren<UiSegmentedItem>(
    forwardRef(() => UiSegmentedItem) as ProviderToken<UiSegmentedItem>,
  );

  readonly enabledItems = computed(() => this.items().filter((item) => !item.disabled()));

  isSelected(item: UiSegmentedItem) {
    return this.selection() === 'single' && this.value() === item.value();
  }

  select(item: UiSegmentedItem) {
    if (this.selection() !== 'single' || item.disabled()) {
      return;
    }

    this.value.set(item.value());
  }

  onKeydown(event: Event) {
    if (
      !(event instanceof KeyboardEvent) ||
      this.selection() !== 'single' ||
      !this.isNavigationKey(event)
    ) {
      return;
    }

    const items = this.enabledItems();

    if (!items.length) {
      return;
    }

    event.preventDefault();

    const activeElement = this.element.nativeElement.ownerDocument.activeElement;
    const focusedIndex = items.findIndex((item) => item.element.nativeElement === activeElement);
    const selectedIndex = items.findIndex((item) => this.isSelected(item));
    const currentIndex = focusedIndex >= 0 ? focusedIndex : selectedIndex;
    const nextIndex = this.getNextIndex(event.key, currentIndex, items.length);
    const nextItem = items[nextIndex];

    this.select(nextItem);
    nextItem.focus();
  }

  private isNavigationKey(event: KeyboardEvent) {
    return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);
  }

  private getNextIndex(key: string, currentIndex: number, itemCount: number) {
    if (key === 'Home') {
      return 0;
    }

    if (key === 'End') {
      return itemCount - 1;
    }

    if (currentIndex < 0) {
      return 0;
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      return (currentIndex + 1) % itemCount;
    }

    return (currentIndex - 1 + itemCount) % itemCount;
  }
}
