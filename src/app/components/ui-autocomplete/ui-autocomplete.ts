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
import { UiLoading } from '../ui-loading/ui-loading';
import { syncPopover } from '../../shared/sync-popover';

export type UiAutocompleteSize = 'sm' | 'md';

@Component({
  selector: 'ui-autocomplete',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, UiInput, UiIcon, UiLoading],
  templateUrl: './ui-autocomplete.html',
  styleUrls: ['../../shared/ui-popup.css', './ui-autocomplete.css'],
})
export class UiAutocomplete implements FormValueControl<string> {
  readonly combobox = viewChild(Combobox);
  readonly listbox = viewChild(Listbox);
  readonly popupElement = viewChild<ElementRef<HTMLElement>>('popupElement');

  value = model('');
  // Query is independent from the committed option value. Consumers own the
  // suggestion source (local computed data, resource, HTTP, cache, etc.).
  query = model('');
  disabled = input(false, { transform: booleanAttribute });
  // Keep the combobox operable while loading: continued typing refines or replaces the pending
  // request. Disabling here would drop focus and prevent the interaction that drives async search.
  loading = input(false, { transform: booleanAttribute });
  label = input('Поиск');
  // Forwarded to the wrapped <ui-input>, which owns the control-size scale.
  size = input<UiAutocompleteSize>('md');
  placeholder = input('Поиск значений');
  emptyText = input('Ничего не найдено');
  loadingText = input('Загрузка');
  withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  selectedValues = signal<string[]>([]);
  popupExpanded = signal(false);
  private queryAfterSelectionClear: string | undefined;

  options = contentChildren(UiAutocompleteOption);

  readonly inlineSuggestion = computed(() => {
    const query = this.query();

    if (!query) {
      return undefined;
    }

    return this.options()
      .find((option) => option.label().toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
      ?.label();
  });

  readonly hasOptions = computed(() => this.options().length > 0);

  constructor() {
    afterRenderEffect(() => {
      const value = this.value();
      const selectedOption = this.options().find((option) => option.value() === value);
      const nextInputValue = value
        ? (selectedOption?.label() ?? '')
        : (this.queryAfterSelectionClear ?? untracked(this.query));
      const nextSelectedValues = value ? [value] : [];
      const selectedValues = untracked(this.selectedValues);

      this.queryAfterSelectionClear = undefined;

      if (untracked(this.query) !== nextInputValue) {
        this.query.set(nextInputValue);
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
      this.query.set(selectedOption.label());
    }

    this.popupExpanded.set(false);
  }

  onQueryChange(query: string) {
    this.query.set(query);

    const selectedValue = this.selectedValues()[0] ?? this.value();
    const selectedOption = this.options().find((option) => option.value() === selectedValue);

    if (selectedOption?.label() === query || (!selectedOption && !this.value())) {
      return;
    }

    // The form value represents a committed option, not arbitrary query text.
    // Once the user edits its label, keeping the old option would make the
    // visible control disagree with the submitted value.
    this.selectedValues.set([]);
    this.queryAfterSelectionClear = query;
    this.value.set('');
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
    this.query.set('');
    this.selectedValues.set([]);
    this.popupExpanded.set(false);
  }

  private areSelectedValuesEqual(first: string[], second: string[]) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }
}
