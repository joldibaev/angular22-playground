import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Listbox, Option } from '@angular/aria/listbox';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { UiSelectGroup } from './ui-select-group/ui-select-group';
import { UiSelectOption } from './ui-select-option/ui-select-option';

type UiSelectRenderItem = {
  group?: UiSelectGroup;
  option?: UiSelectOption;
};

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

  private element = inject(ElementRef<HTMLElement>);

  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });
  }

  onListboxClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('[role="option"]')) {
      this.onCommit();
    }
  }

  onCommit() {
    this.popupExpanded.set(false);
  }
}
