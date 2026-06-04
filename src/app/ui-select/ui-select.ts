import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Listbox, Option } from '@angular/aria/listbox';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { UiSelectOption } from './ui-select-option/ui-select-option';

@Component({
  selector: 'ui-select',
  imports: [NgTemplateOutlet, Combobox, ComboboxPopup, Listbox, ComboboxWidget, Option],
  templateUrl: './ui-select.html',
  styleUrl: './ui-select.css',
})
export class UiSelect {
  readonly listbox = viewChild(Listbox);

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

  options = contentChildren(UiSelectOption);

  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });
  }

  onCommit() {
    this.popupExpanded.set(false);
  }
}
