import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import type { FormValueControl } from '@angular/forms/signals';
import { UiInput } from '../ui-input/ui-input';
import { UiAutocompleteOption } from './ui-autocomplete-option/ui-autocomplete-option';
import { UiIcon } from '../ui-icon/ui-icon';
import { syncPopover } from '../../shared/sync-popover';

@Component({
  selector: 'ui-autocomplete',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, UiInput, UiIcon],
  templateUrl: './ui-autocomplete.html',
  styleUrls: ['../../shared/ui-popup.css', './ui-autocomplete.css'],
})
export class UiAutocomplete implements FormValueControl<string> {
  readonly combobox = viewChild(Combobox);
  readonly listbox = viewChild(Listbox);
  readonly popupElement = viewChild<ElementRef<HTMLElement>>('popupElement');

  value = model('');
  disabled = input(false, { transform: booleanAttribute });
  label = input('Search');
  placeholder = input('Search labels');
  emptyText = input('No matches');
  withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  inputValue = signal('');
  selectedValues = signal<string[]>([]);
  popupExpanded = signal(false);

  options = contentChildren(UiAutocompleteOption);

  readonly filteredOptions = computed(() => {
    const query = this.inputValue().trim().toLocaleLowerCase();

    if (!query) {
      return this.options();
    }

    return this.options().filter((option) => option.label().toLocaleLowerCase().includes(query));
  });

  readonly inlineSuggestion = computed(() => {
    const query = this.inputValue();

    if (!query) {
      return undefined;
    }

    return this.filteredOptions()
      .find((option) => option.label().toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
      ?.label();
  });

  readonly hasOptions = computed(() => this.filteredOptions().length > 0);

  constructor() {
    afterRenderEffect(() => {
      const value = this.value();
      const selectedOption = this.options().find((option) => option.value() === value);
      const nextInputValue = selectedOption?.label() ?? '';
      const nextSelectedValues = value ? [value] : [];
      const selectedValues = untracked(this.selectedValues);

      if (untracked(this.inputValue) !== nextInputValue) {
        this.inputValue.set(nextInputValue);
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

  onCommit() {
    const selectedValue = this.selectedValues()[0];
    const selectedOption = this.options().find((option) => option.value() === selectedValue);

    if (selectedOption) {
      this.value.set(selectedOption.value());
      this.inputValue.set(selectedOption.label());
    }

    this.popupExpanded.set(false);
  }

  onListboxClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('[role="option"]')) {
      this.onCommit();
    }
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
    this.value.set('');
    this.inputValue.set('');
    this.selectedValues.set([]);
    this.popupExpanded.set(false);
  }

  private areSelectedValuesEqual(first: string[], second: string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }
}
