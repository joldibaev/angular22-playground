import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { UiSegmented } from '../ui-segmented';

@Component({
  selector: 'ui-segmented-item',
  template: '<ng-content />',
  host: {
    class: 'ui-segmented-item',
    '[class.ui-segmented-item-active]': 'selected()',
    '[attr.role]': 'segmented.selection() === "single" ? "radio" : null',
    '[attr.aria-checked]': 'segmented.selection() === "single" ? selected() : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.tabindex]': 'tabIndex()',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onActionKeydown($event)',
    '(keydown.space)': 'onActionKeydown($event)',
  },
})
export class UiSegmentedItem {
  readonly segmented = inject(UiSegmented);
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selected = computed(() => this.segmented.isSelected(this));
  readonly tabIndex = computed(() => {
    if (this.segmented.selection() !== 'single') {
      return null;
    }

    if (this.disabled()) {
      return -1;
    }

    return this.selected() ? 0 : -1;
  });

  constructor() {
    afterRenderEffect(() => {
      this.syncDefaultValue();
    });
  }

  onClick(event: MouseEvent) {
    if (this.segmented.selection() !== 'single' || this.disabled() || event.defaultPrevented) {
      return;
    }

    this.segmented.select(this);
    this.focus();
  }

  onActionKeydown(event: Event) {
    if (this.segmented.selection() !== 'single' || this.disabled()) {
      return;
    }

    event.preventDefault();
    this.segmented.select(this);
  }

  focus() {
    this.element.nativeElement.focus();
  }

  private syncDefaultValue() {
    if (this.segmented.selection() !== 'single' || this.segmented.value() !== undefined) {
      return;
    }

    this.segmented.select(this);
  }
}
