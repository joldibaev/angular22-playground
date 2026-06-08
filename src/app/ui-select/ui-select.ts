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

type UiSelectRenderItem = {
  group?: UiSelectGroup;
  option?: UiSelectOption;
};

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
  styleUrl: './ui-select.css',
})
export class UiSelect implements FormValueControl<string> {
  readonly combobox = viewChild(Combobox);
  readonly listbox = viewChild(Listbox);
  readonly popupElement = viewChild<ElementRef<HTMLElement>>('popupElement');

  value = model('');
  disabled = input(false);
  label = input('Select');
  showError = input(false, { transform: booleanAttribute });
  touch = output<void>();

  selectedValues = signal<string[]>([]);
  popupExpanded = signal(false);

  readonly displayValue = computed(() => {
    if (this.selectedValues().length) {
      const options = this.options().filter((option) =>
        this.selectedValues().includes(option.value()),
      );
      return options.map((option) => option.label()).join(', ');
    }

    return 'Select a label';
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
      const nextSelectedValues = value ? [value] : [];
      const selectedValues = untracked(this.selectedValues);

      if (value && selectedValues.includes(value)) {
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
      this.syncPopover(this.popupElement()?.nativeElement, this.popupExpanded());
    });
  }

  onListboxClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('[role="option"]')) {
      this.onCommit();
    }
  }

  onCommit() {
    this.value.set(this.selectedValues()[0] ?? '');
    this.popupExpanded.set(false);
  }

  onPopupToggle(event: Event) {
    if ((event as { newState?: string }).newState === 'closed') {
      this.popupExpanded.set(false);
    }
  }

  focus(options?: FocusOptions) {
    this.combobox()?.element.focus(options);
  }

  reset() {
    this.value.set('');
    this.selectedValues.set([]);
    this.popupExpanded.set(false);
  }

  private areSelectedValuesEqual(first: string[], second: string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  private syncPopover(element: HTMLElement | undefined, expanded: boolean) {
    if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
      return;
    }

    if (expanded && !element.matches(':popover-open')) {
      element.showPopover();
    } else if (!expanded && element.matches(':popover-open')) {
      element.hidePopover();
    }
  }
}
