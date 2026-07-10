import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import type { FormValueControl } from '@angular/forms/signals';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiInput } from '../ui-input/ui-input';
import { syncPopover } from '../../shared/sync-popover';
import { parseInputDate } from '../../shared/date.utils';
import { nextId } from '../../shared/unique-id';
import { formatMonthLabel, WEEKDAYS_MON_FIRST } from '../ui-datepicker/calendar.utils';
import {
  buildPresets,
  buildRangeMonthGrid,
  formatRangeDisplay,
  normalizeRange,
  type RangeDay,
  rangeToView,
  type UiDateRangeValue,
} from './range-calendar.utils';

export type UiDateRangePickerSize = 'sm' | 'md';

const INITIAL_VIEW = new Temporal.PlainYearMonth(1970, 1);

// Range picking keeps a draft until Apply, unlike the single picker which can
// commit immediately. Keep it as a separate public control and share calendar math.
@Component({
  selector: 'ui-date-range-picker',
  imports: [Grid, GridCell, GridRow, UiIcon, UiInput],
  templateUrl: './ui-date-range-picker.html',
  // Shares the popover surface/box + open/close/flip animation with the menu,
  // select, and single datepicker popups (ui-popup.css). The range picker
  // overrides only the structural tokens it needs in its own stylesheet, which
  // loads second so its overrides win.
  styleUrls: [
    '../../shared/ui-popup.css',
    '../../shared/calendar-month-swap.css',
    '../../shared/calendar-trigger-swap.css',
    './ui-date-range-picker.css',
  ],
  host: {
    '[style.anchor-scope]': 'anchorName',
  },
})
export class UiDateRangePicker implements FormValueControl<UiDateRangeValue> {
  private readonly id = nextId();

  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly triggerLabel = viewChild.required<ElementRef<HTMLElement>>('triggerLabel');
  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly grid = viewChild(Grid);

  readonly value = model<UiDateRangeValue>({ start: '', end: '' });
  readonly disabled = input(false, { transform: booleanAttribute });
  // Loading is passive, like ui-input/select/autocomplete: an existing range remains usable while
  // availability or metadata refreshes. Consumers can bind disabled as well when truly unavailable.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly label = input('Диапазон дат');
  // Forwarded to the wrapped <ui-input>; the trigger reads its control-size tokens.
  readonly size = input<UiDateRangePickerSize>('md');
  readonly placeholder = input('Выберите диапазон дат');
  readonly presetsLabel = input('Быстрые диапазоны');
  readonly previousMonthLabel = input('Предыдущий месяц');
  readonly nextMonthLabel = input('Следующий месяц');
  // Boundaries are named `minDate`/`maxDate`, not `min`/`max` like the single
  // `ui-datepicker`. The signal-forms `FormUiControl<TValue>` contract reserves
  // `min`/`max` typed as `NonNullable<TValue>`, and `[formField]` matches it
  // structurally. Since `value` here is a range object, naming these `min`/`max`
  // would force them to be range objects too (or break `[formField]` binding).
  // Do not rename them back to `min`/`max`.
  readonly minDate = input<string | undefined>(undefined);
  readonly maxDate = input<string | undefined>(undefined);
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  readonly withPresets = input(true, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly panelId = `ui-date-range-panel-${this.id}`;
  readonly titleId = `ui-date-range-title-${this.id}`;
  readonly anchorName = `--ui-date-range-trigger-${this.id}`;

  readonly popupExpanded = signal(false);
  // Keep the closed first render identical on the server and client; local
  // calendar time is captured only when the user opens the control.
  readonly leftView = signal(INITIAL_VIEW);
  readonly monthSwapPhase = signal<'idle' | 'exit' | 'enter-start'>('idle');
  readonly monthSwapDirection = signal<'previous' | 'next'>('next');
  readonly draftStart = signal('');
  readonly draftEnd = signal('');
  readonly hoverDate = signal('');
  readonly selectingEnd = signal(false);

  readonly weekdays = WEEKDAYS_MON_FIRST;
  readonly today = signal('');
  readonly presets = buildPresets(() => Temporal.Now.plainDateISO());

  readonly committedRange = computed(() => normalizeRange(this.value()));
  readonly draftRange = computed(() =>
    normalizeRange({ start: this.draftStart(), end: this.draftEnd() }),
  );
  readonly displayValue = computed(() => formatRangeDisplay(this.committedRange()));
  readonly draftDisplayValue = computed(
    () => formatRangeDisplay(this.draftRange()) || 'Диапазон не выбран',
  );
  readonly isPlaceholderVisible = computed(() => this.displayValue().length === 0);
  readonly displayedTriggerValue = signal('');
  readonly displayedTriggerPlaceholder = signal(true);
  readonly triggerSwapPhase = signal<'idle' | 'exit' | 'enter-start'>('idle');
  readonly rightView = computed(() => this.leftView().add({ months: 1 }));
  readonly leftMonthLabel = computed(() => formatMonthLabel(this.leftView()));
  readonly rightMonthLabel = computed(() => formatMonthLabel(this.rightView()));
  readonly panelLabel = computed(() => `${this.leftMonthLabel()} и ${this.rightMonthLabel()}`);
  readonly leftWeeks = computed(() => this.buildWeeks(this.leftView()));
  readonly rightWeeks = computed(() => this.buildWeeks(this.rightView()));
  readonly canApplyDraft = computed(() => {
    const draft = this.draftRange();
    const committed = this.committedRange();
    const isComplete = (draft.start && draft.end) || (!draft.start && !draft.end);

    return Boolean(isComplete && (draft.start !== committed.start || draft.end !== committed.end));
  });

  // The previous month is reachable while any of its days is >= min, i.e.
  // while that whole month is not before min's month (same idea for max).
  readonly canGoPrev = computed(() => {
    const min = parseInputDate(this.minDate() ?? '');

    if (!min) {
      return true;
    }

    const prevMonth = this.leftView().subtract({ months: 1 });

    return Temporal.PlainYearMonth.compare(prevMonth, min.toPlainYearMonth()) >= 0;
  });

  readonly canGoNext = computed(() => {
    const max = parseInputDate(this.maxDate() ?? '');

    if (!max) {
      return true;
    }

    const monthAfterRight = this.rightView().add({ months: 1 });

    return Temporal.PlainYearMonth.compare(monthAfterRight, max.toPlainYearMonth()) <= 0;
  });
  private pendingLeftView: Temporal.PlainYearMonth | undefined;
  private focusAfterMonthSwap = false;
  private pendingTriggerValue = '';
  private pendingTriggerPlaceholder = true;
  private triggerDisplayInitialized = false;

  constructor() {
    afterRenderEffect(() => {
      const nextPlaceholder = this.isPlaceholderVisible();
      const nextValue = this.displayValue() || this.placeholder();
      const currentValue = untracked(this.displayedTriggerValue);
      const currentPlaceholder = untracked(this.displayedTriggerPlaceholder);

      if (!this.triggerDisplayInitialized) {
        this.triggerDisplayInitialized = true;
        this.displayedTriggerValue.set(nextValue);
        this.displayedTriggerPlaceholder.set(nextPlaceholder);
        this.pendingTriggerValue = nextValue;
        this.pendingTriggerPlaceholder = nextPlaceholder;
        return;
      }

      if (nextValue === currentValue && nextPlaceholder === currentPlaceholder) {
        this.pendingTriggerValue = nextValue;
        this.pendingTriggerPlaceholder = nextPlaceholder;

        if (untracked(this.triggerSwapPhase) === 'exit') {
          this.triggerSwapPhase.set('idle');
        }

        return;
      }

      this.pendingTriggerValue = nextValue;
      this.pendingTriggerPlaceholder = nextPlaceholder;
      this.triggerSwapPhase.set('exit');
    });

    afterRenderEffect(() => {
      syncPopover(this.panel()?.nativeElement, this.popupExpanded());
    });

    afterRenderEffect(() => {
      if (this.triggerSwapPhase() !== 'enter-start') {
        return;
      }

      void this.triggerLabel().nativeElement.offsetHeight;
      this.triggerSwapPhase.set('idle');
    });

    afterRenderEffect(() => {
      if (!this.popupExpanded()) {
        return;
      }

      queueMicrotask(() => this.focusInitialCell());
    });

    afterRenderEffect(() => {
      if (this.monthSwapPhase() !== 'enter-start') {
        return;
      }

      // Reflow separates the no-transition start pose from the directional entrance.
      void this.panel()?.nativeElement.offsetHeight;
      this.monthSwapPhase.set('idle');
      this.pendingLeftView = undefined;

      if (this.focusAfterMonthSwap) {
        this.focusAfterMonthSwap = false;
        queueMicrotask(() => this.focusInitialCell());
      }
    });
  }

  toggle() {
    if (this.popupExpanded()) {
      this.cancel({ returnFocus: false });
    } else {
      this.open();
    }
  }

  open() {
    if (this.disabled()) {
      return;
    }

    const range = this.committedRange();
    const today = Temporal.Now.plainDateISO().toString();

    this.today.set(today);
    this.draftStart.set(range.start);
    this.draftEnd.set(range.end);
    this.hoverDate.set('');
    this.selectingEnd.set(Boolean(range.start && !range.end));
    this.monthSwapPhase.set('idle');
    this.pendingLeftView = undefined;
    this.focusAfterMonthSwap = false;
    this.leftView.set(rangeToView(range, today));
    this.popupExpanded.set(true);
  }

  cancel(options: { returnFocus?: boolean } = {}) {
    if (!this.popupExpanded()) {
      return;
    }

    this.popupExpanded.set(false);
    this.touch.emit();
    this.clearDraft();

    if (options.returnFocus !== false) {
      queueMicrotask(() => this.trigger()?.nativeElement.focus());
    }
  }

  reset() {
    this.draftStart.set('');
    this.draftEnd.set('');
    this.hoverDate.set('');
    this.selectingEnd.set(false);
  }

  applyDraft() {
    if (!this.canApplyDraft()) {
      return;
    }

    this.value.set(this.draftRange());
    this.popupExpanded.set(false);
    this.touch.emit();
    this.clearDraft();
    queueMicrotask(() => this.trigger()?.nativeElement.focus());
  }

  previousMonth() {
    if (this.canGoPrev()) {
      this.shiftView(-1, false);
    }
  }

  nextMonth() {
    if (this.canGoNext()) {
      this.shiftView(1, false);
    }
  }

  onTriggerTransitionEnd(event: TransitionEvent) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'opacity' ||
      this.triggerSwapPhase() !== 'exit'
    ) {
      return;
    }

    this.displayedTriggerValue.set(this.pendingTriggerValue);
    this.displayedTriggerPlaceholder.set(this.pendingTriggerPlaceholder);
    this.triggerSwapPhase.set('enter-start');
  }

  onMonthTransitionEnd(event: TransitionEvent) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'opacity' ||
      this.monthSwapPhase() !== 'exit' ||
      !this.pendingLeftView
    ) {
      return;
    }

    this.leftView.set(this.pendingLeftView);
    this.monthSwapPhase.set('enter-start');
  }

  applyPreset(preset: { range: () => UiDateRangeValue }) {
    const range = normalizeRange(preset.range());

    if (!this.isRangeAllowed(range)) {
      return;
    }

    this.draftStart.set(range.start);
    this.draftEnd.set(range.end);
    this.hoverDate.set('');
    this.selectingEnd.set(false);
    this.transitionToView(rangeToView(range, this.today()), false);
  }

  isPresetAllowed(preset: { range: () => UiDateRangeValue }) {
    return this.isRangeAllowed(normalizeRange(preset.range()));
  }

  onDaySelectionChange(day: RangeDay, selected: boolean) {
    if (!selected || day.disabled || !day.inCurrentMonth) {
      return;
    }

    if (!this.selectingEnd()) {
      this.draftStart.set(day.date);
      this.draftEnd.set('');
      this.hoverDate.set('');
      this.selectingEnd.set(true);
      return;
    }

    const normalized = normalizeRange({ start: this.draftStart(), end: day.date });

    this.draftStart.set(normalized.start);
    this.draftEnd.set(normalized.end);
    this.hoverDate.set('');
    this.selectingEnd.set(false);
  }

  onCellHover(day: RangeDay) {
    if (!this.selectingEnd() || day.disabled || !day.inCurrentMonth) {
      return;
    }

    this.hoverDate.set(day.date);
  }

  onPanelLeave() {
    this.hoverDate.set('');
  }

  onPanelToggle(event: ToggleEvent) {
    if (event.newState !== 'closed' || !this.popupExpanded()) {
      return;
    }

    this.popupExpanded.set(false);
    this.touch.emit();
    this.clearDraft();
  }

  onPanelKeydown(event: KeyboardEvent) {
    // Home/End belong to the Angular Aria grid's row navigation. This panel only
    // layers calendar-specific month/year shortcuts on top of that keyboard model.
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }

    if (event.key === 'PageUp') {
      event.preventDefault();
      this.shiftView(event.shiftKey ? -12 : -1);
      return;
    }

    if (event.key === 'PageDown') {
      event.preventDefault();
      this.shiftView(event.shiftKey ? 12 : 1);
      return;
    }

  }

  focus(options?: FocusOptions) {
    this.trigger()?.nativeElement.focus(options);
  }

  private buildWeeks(view: Temporal.PlainYearMonth) {
    return buildRangeMonthGrid(view, {
      range: this.draftRange(),
      pending: {
        start: this.draftStart(),
        hover: this.hoverDate(),
        selectingEnd: this.selectingEnd(),
      },
      today: this.today(),
      min: this.minDate(),
      max: this.maxDate(),
    });
  }

  private shiftView(months: number, withFocus = true) {
    if (this.monthSwapPhase() === 'exit') {
      return;
    }

    this.transitionToView((this.pendingLeftView ?? this.leftView()).add({ months }), withFocus);
  }

  private transitionToView(nextView: Temporal.PlainYearMonth, withFocus: boolean) {
    const currentView = this.leftView();

    if (nextView.equals(currentView)) {
      if (withFocus) {
        queueMicrotask(() => this.focusInitialCell());
      }

      return;
    }

    this.pendingLeftView = nextView;
    this.focusAfterMonthSwap = withFocus;
    this.monthSwapDirection.set(
      Temporal.PlainYearMonth.compare(nextView, currentView) < 0 ? 'previous' : 'next',
    );
    this.monthSwapPhase.set('exit');
  }

  private focusInitialCell() {
    const panel = this.panel()?.nativeElement;
    const target =
      panel?.querySelector<HTMLElement>('td[data-focus-target="true"]') ??
      panel?.querySelector<HTMLElement>('td[tabindex="0"]');

    target?.focus();
    this.grid()?.scrollActiveCellIntoView({ block: 'nearest', inline: 'nearest' });
  }

  private isRangeAllowed(range: UiDateRangeValue) {
    const start = parseInputDate(range.start);
    const end = parseInputDate(range.end);

    if (!start || !end) {
      return false;
    }

    const min = parseInputDate(this.minDate() ?? '');
    const max = parseInputDate(this.maxDate() ?? '');

    return (
      (!min || Temporal.PlainDate.compare(start, min) >= 0) &&
      (!max || Temporal.PlainDate.compare(end, max) <= 0)
    );
  }

  private clearDraft() {
    this.draftStart.set('');
    this.draftEnd.set('');
    this.hoverDate.set('');
    this.selectingEnd.set(false);
  }
}

export type { UiDateRangeValue };
