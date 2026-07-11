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
  untracked,
  viewChild,
} from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import type { FormValueControl } from '@angular/forms/signals';
import { UiInput } from '../ui-input/ui-input';
import { UiSelectGroup } from './ui-select-group/ui-select-group';
import { UiSelectOption } from './ui-select-option/ui-select-option';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiLoading } from '../ui-loading/ui-loading';
import { syncPopover } from '../../shared/sync-popover';
import { afterElementAnimations } from '../../shared/after-element-animations';

type UiSelectRenderItem = {
  group?: UiSelectGroup;
  option?: UiSelectOption;
};
export type UiSelectValue = string | string[];
export type UiSelectSize = 'sm' | 'md';

@Component({
  selector: 'ui-select',
  imports: [Combobox, ComboboxPopup, Listbox, ComboboxWidget, Option, UiInput, UiIcon, UiLoading],
  templateUrl: './ui-select.html',
  styleUrls: ['../../shared/ui-popup.css', './ui-select.css'],
})
export class UiSelect implements FormValueControl<UiSelectValue> {
  readonly combobox = viewChild(Combobox);
  readonly listbox = viewChild(Listbox);
  readonly popupElement = viewChild<ElementRef<HTMLElement>>('popupElement');
  readonly selectedLabelElement = viewChild.required<ElementRef<HTMLElement>>('selectedLabel');

  value = model<UiSelectValue>('');
  disabled = input(false, { transform: booleanAttribute });
  // Loading does not imply disabled: previously loaded options remain useful during a refresh,
  // and an empty popup can explain that options are pending. Consumers may bind both for a
  // strictly unavailable initial load.
  loading = input(false, { transform: booleanAttribute });
  label = input('Выбор');
  // Forwarded to the wrapped <ui-input>, which owns the control-size scale.
  size = input<UiSelectSize>('md');
  loadingText = input('Загрузка');
  multi = input(false, { transform: booleanAttribute });
  placeholder = input('Выберите значение');
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
  readonly displayedValue = signal('');
  readonly displayedPlaceholder = signal(true);
  readonly valueSwapPhase = signal<'idle' | 'exit' | 'enter-start'>('idle');
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
  private pendingDisplayValue = '';
  private pendingPlaceholder = true;
  private valueDisplayInitialized = false;

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
      if (this.valueSwapPhase() === 'exit') {
        afterElementAnimations(this.selectedLabelElement().nativeElement, () =>
          this.finishValueSwap(),
        );
      }
    });

    afterRenderEffect(() => {
      const nextValue = this.displayValue();
      const nextPlaceholder = this.isPlaceholderVisible();
      const currentValue = untracked(this.displayedValue);
      const currentPlaceholder = untracked(this.displayedPlaceholder);

      if (!this.valueDisplayInitialized) {
        this.valueDisplayInitialized = true;
        this.displayedValue.set(nextValue);
        this.displayedPlaceholder.set(nextPlaceholder);
        this.pendingDisplayValue = nextValue;
        this.pendingPlaceholder = nextPlaceholder;
        return;
      }

      if (nextValue === currentValue && nextPlaceholder === currentPlaceholder) {
        this.pendingDisplayValue = nextValue;
        this.pendingPlaceholder = nextPlaceholder;

        if (untracked(this.valueSwapPhase) === 'exit') {
          this.valueSwapPhase.set('idle');
        }

        return;
      }

      this.pendingDisplayValue = nextValue;
      this.pendingPlaceholder = nextPlaceholder;
      this.valueSwapPhase.set('exit');
    });

    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });

    afterRenderEffect(() => {
      syncPopover(this.popupElement()?.nativeElement, this.popupExpanded());
    });

    afterRenderEffect(() => {
      if (this.valueSwapPhase() !== 'enter-start') {
        return;
      }

      // Reflow separates the no-transition start pose from the animated entrance.
      void this.selectedLabelElement().nativeElement.offsetHeight;
      this.valueSwapPhase.set('idle');
    });
  }

  onValueTransitionEnd(event: TransitionEvent) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'opacity' ||
      this.valueSwapPhase() !== 'exit'
    ) {
      return;
    }

    this.finishValueSwap();
  }

  private finishValueSwap(): void {
    if (this.valueSwapPhase() !== 'exit') {
      return;
    }

    this.displayedValue.set(this.pendingDisplayValue);
    this.displayedPlaceholder.set(this.pendingPlaceholder);
    this.valueSwapPhase.set('enter-start');
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
