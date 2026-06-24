import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
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
  imports: [
    NgTemplateOutlet,
    Combobox,
    ComboboxPopup,
    Listbox,
    ComboboxWidget,
    Option,
    UiInput,
    UiIcon,
  ],
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

  selectedValues = signal<string[]>([]);
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
    effect(() => {
      const value = this.value();
      const nextSelectedValues = this.parseValue(value);
      const selectedValues = untracked(this.selectedValues);

      if (value && this.areSelectedValuesEqual(selectedValues, nextSelectedValues)) {
        return;
      }

      if (!value && selectedValues.length === 0) {
        return;
      }

      if (!this.areSelectedValuesEqual(selectedValues, nextSelectedValues)) {
        this.selectedValues.set(nextSelectedValues);
      }
    });

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
      return this.multi() ? value : (value[0] ? [value[0]] : []);
    }

    return this.multi() ? value.split(',').filter(Boolean) : value ? [value] : [];
  }

  private formatValue(values: string[]): UiSelectValue {
    return this.multi() ? values : (values[0] ?? '');
  }

  private areSelectedValuesEqual(first: string[], second: string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }
}
