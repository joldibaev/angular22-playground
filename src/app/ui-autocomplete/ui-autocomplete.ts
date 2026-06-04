import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { UiAutocompleteOption } from './ui-autocomplete-option/ui-autocomplete-option';

@Component({
  selector: 'ui-autocomplete',
  imports: [NgTemplateOutlet, Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option],
  templateUrl: './ui-autocomplete.html',
  styleUrl: './ui-autocomplete.css',
})
export class UiAutocomplete {
  readonly listbox = viewChild(Listbox);

  value = signal('');
  selectedValues = signal<string[]>([]);
  popupExpanded = signal(false);

  options = contentChildren(UiAutocompleteOption);

  readonly filteredOptions = computed(() => {
    const query = this.value().trim().toLocaleLowerCase();

    if (!query) {
      return this.options();
    }

    return this.options().filter((option) =>
      option.label().toLocaleLowerCase().includes(query),
    );
  });

  readonly inlineSuggestion = computed(() => {
    const query = this.value();

    if (!query) {
      return undefined;
    }

    return this.filteredOptions().find((option) =>
      option.label().toLocaleLowerCase().startsWith(query.toLocaleLowerCase()),
    )?.label();
  });

  readonly hasOptions = computed(() => this.filteredOptions().length > 0);

  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });
  }

  onCommit() {
    const selectedValue = this.selectedValues()[0];
    const selectedOption = this.options().find((option) => option.value() === selectedValue);

    if (selectedOption) {
      this.value.set(selectedOption.label());
    }

    this.popupExpanded.set(false);
  }
}
