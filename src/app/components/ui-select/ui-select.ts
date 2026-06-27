import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import type { FormValueControl } from '@angular/forms/signals';
import { UiInput } from '../ui-input/ui-input';
import { UiSelectGroup } from './ui-select-group/ui-select-group';
import { UiSelectOption } from './ui-select-option/ui-select-option';
import { UiIcon } from '../ui-icon/ui-icon';
import { syncPopover } from '../../shared/sync-popover';

type UiSelectRenderItem = {
  group?: UiSelectGroup;
  option?: UiSelectOption;
};
export type UiSelectValue = string | string[];

@Component({
  selector: 'ui-select',
  imports: [Combobox, ComboboxPopup, Listbox, ComboboxWidget, Option, UiInput, UiIcon],
  templateUrl: './ui-select.html',
  styleUrls: ['../../shared/ui-popup.css', './ui-select.css'],
})
export class UiSelect implements FormValueControl<UiSelectValue> {
  readonly combobox = viewChild(Combobox);
  readonly listbox = viewChild(Listbox);
  readonly popupElement = viewChild<ElementRef<HTMLElement>>('popupElement');

  value = model<UiSelectValue>('');
  disabled = input(false, { transform: booleanAttribute });
  label = input('Select');
  multi = input(false, { transform: booleanAttribute });
  placeholder = input('Select a label');
  withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  // Local selection mirror. `linkedSignal` recomputes from `value` whenever the
  // bound value changes, but still accepts direct writes from the listbox
  // two-way binding / `onCommit` until the next `value` change — no manual
  // effect-based reconciliation or equality guards needed.
  selectedValues = linkedSignal<string[]>(() => this.parseValue(this.value()));
  popupExpanded = signal(false);

  readonly displayValue = computed(() => {
    const options = this.selectedOptions();

    if (options.length) {
      return options.map((option) => option.label()).join(', ');
    }

    return this.placeholder();
  });
  readonly isPlaceholderVisible = computed(() => this.selectedOptions().length === 0);
  private readonly selectedOptions = computed(() => {
    const selectedValues = new Set(this.selectedValues());
    const emittedValues = new Set<string>();
    const selectedOptions: UiSelectOption[] = [];

    for (const option of this.options()) {
      const value = option.value();

      if (selectedValues.has(value) && !emittedValues.has(value)) {
        selectedOptions.push(option);
        emittedValues.add(value);
      }
    }

    return selectedOptions;
  });

  options = contentChildren(UiSelectOption, { descendants: true });
  groups = contentChildren(UiSelectGroup);

  readonly renderItems = computed<UiSelectRenderItem[]>(() => {
    const groups = this.groups();
    const groupedOptions = new Set(groups.flatMap((group) => group.options()));
    const directOptions = this.options().filter((option) => !groupedOptions.has(option));
    const items: UiSelectRenderItem[] = [
      ...directOptions.map((option) => ({ option })),
      ...groups.map((group) => ({ group })),
    ];

    return items.sort((first, second) => {
      const firstElement = (first.group ?? first.option)?.element.nativeElement;
      const secondElement = (second.group ?? second.option)?.element.nativeElement;

      if (!firstElement || !secondElement) {
        return 0;
      }

      return firstElement.compareDocumentPosition(secondElement) & Node.DOCUMENT_POSITION_PRECEDING
        ? -1
        : 1;
    });
  });

  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });

    afterRenderEffect(() => {
      syncPopover(this.popupElement()?.nativeElement, this.popupExpanded());
    });
  }

  onListboxClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('[role="option"]')) {
      this.onCommit();
    }
  }

  onCommit() {
    this.value.set(this.formatValue(this.selectedValues()));

    this.popupExpanded.set(this.multi());
  }

  onPopupToggle(event: ToggleEvent) {
    if (event.newState === 'closed') {
      this.popupExpanded.set(false);
    }
  }

  focus(options?: FocusOptions) {
    this.combobox()?.element.focus(options);
  }

  reset() {
    this.value.set(this.multi() ? [] : '');
    this.selectedValues.set([]);
    this.popupExpanded.set(false);
  }

  private parseValue(value: UiSelectValue): string[] {
    if (Array.isArray(value)) {
      return this.multi() ? value : value[0] ? [value[0]] : [];
    }

    if (!this.multi()) {
      return value ? [value] : [];
    }

    if (!value) {
      return [];
    }

    // A whole string that matches a real option value wins over comma-splitting,
    // so an option value may legitimately contain a comma. Otherwise fall back
    // to legacy comma-delimited parsing.
    const optionValues = new Set(this.options().map((option) => option.value()));

    return optionValues.has(value) ? [value] : value.split(',').filter(Boolean);
  }

  private formatValue(values: string[]): UiSelectValue {
    return this.multi() ? values : (values[0] ?? '');
  }
}
