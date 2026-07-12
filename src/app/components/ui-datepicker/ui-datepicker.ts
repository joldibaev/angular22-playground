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
import { afterElementAnimations } from '../../shared/after-element-animations';
import {
  buildMonthGrid,
  type CalendarDay,
  formatDisplayDate,
  formatMonthLabel,
  WEEKDAYS_MON_FIRST,
} from './calendar.utils';

const INITIAL_VIEW = new Temporal.PlainYearMonth(1970, 1);

// Keep the public picker single-value focused. Range picking has different
// draft/commit behavior, but both variants can share the calendar math here.
@Component({
  selector: 'ui-datepicker',
  imports: [Grid, GridCell, GridRow, UiIcon, UiInput],
  templateUrl: './ui-datepicker.html',
  // Shares the popover surface/box + open/close/flip animation with the menu and
  // select popups (ui-popup.css). The calendar overrides only the visual tokens
  // it needs in ui-datepicker.css, which loads second so its overrides win.
  styleUrls: [
    '../../shared/ui-popup.css',
    '../../shared/calendar-month-swap.css',
    '../../shared/calendar-trigger-swap.css',
    './ui-datepicker.css',
  ],
  host: {
    '[style.anchor-scope]': 'anchorName',
  },
})
export class UiDatepicker implements FormValueControl<string> {
  private readonly id = nextId();

  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly triggerLabel = viewChild.required<ElementRef<HTMLElement>>('triggerLabel');
  readonly monthTitle = viewChild.required<ElementRef<HTMLElement>>('monthTitle');
  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly grid = viewChild(Grid);

  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  // Loading is passive, like ui-input/select/autocomplete: existing dates remain usable while
  // availability or metadata refreshes. Consumers can bind disabled as well when truly unavailable.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly label = input('Дата');
  readonly placeholder = input('Выберите дату');
  readonly previousMonthLabel = input('Предыдущий месяц');
  readonly nextMonthLabel = input('Следующий месяц');
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly panelId = `ui-datepicker-panel-${this.id}`;
  readonly titleId = `ui-datepicker-title-${this.id}`;
  readonly anchorName = `--ui-datepicker-trigger-${this.id}`;

  readonly popupExpanded = signal(false);
  // Keep the first server/client render deterministic. The real local date is
  // read when the user opens the calendar, after hydration has completed.
  readonly view = signal(INITIAL_VIEW);
  readonly monthSwapPhase = signal<'idle' | 'exit' | 'enter-start'>('idle');
  readonly monthSwapDirection = signal<'previous' | 'next'>('next');

  readonly weekdays = WEEKDAYS_MON_FIRST;
  readonly today = signal('');

  readonly displayValue = computed(() => formatDisplayDate(this.value()));
  readonly isPlaceholderVisible = computed(() => this.displayValue().length === 0);
  readonly displayedTriggerValue = signal('');
  readonly displayedTriggerPlaceholder = signal(true);
  readonly triggerSwapPhase = signal<'idle' | 'exit' | 'enter-start'>('idle');
  readonly isTodayAllowed = computed(() => this.isDateAllowed(this.today()));
  readonly monthLabel = computed(() => formatMonthLabel(this.view()));
  readonly weeks = computed(() =>
    buildMonthGrid(this.view(), {
      selected: this.value(),
      today: this.today(),
      min: this.min(),
      max: this.max(),
    }),
  );

  // The previous month is reachable while any of its days is >= min, i.e.
  // while that whole month is not before min's month (same idea for max).
  readonly canGoPrev = computed(() => {
    const minDate = parseInputDate(this.min() ?? '');

    if (!minDate) {
      return true;
    }

    const prevMonth = this.view().subtract({ months: 1 });

    return Temporal.PlainYearMonth.compare(prevMonth, minDate.toPlainYearMonth()) >= 0;
  });

  readonly canGoNext = computed(() => {
    const maxDate = parseInputDate(this.max() ?? '');

    if (!maxDate) {
      return true;
    }

    const nextMonth = this.view().add({ months: 1 });

    return Temporal.PlainYearMonth.compare(nextMonth, maxDate.toPlainYearMonth()) <= 0;
  });
  private pendingView: Temporal.PlainYearMonth | undefined;
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
      if (this.triggerSwapPhase() === 'exit') {
        afterElementAnimations(this.triggerLabel().nativeElement, () => this.finishTriggerSwap());
      }
    });

    afterRenderEffect(() => {
      if (this.triggerSwapPhase() !== 'enter-start') {
        return;
      }

      void this.triggerLabel().nativeElement.offsetHeight;
      this.triggerSwapPhase.set('idle');
    });

    afterRenderEffect(() => {
      if (this.monthSwapPhase() === 'exit') {
        afterElementAnimations(this.monthTitle().nativeElement, () => this.finishMonthSwap());
      }
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
      this.pendingView = undefined;

      if (this.focusAfterMonthSwap) {
        this.focusAfterMonthSwap = false;
        queueMicrotask(() => this.focusInitialCell());
      }
    });
  }

  toggle() {
    if (this.popupExpanded()) {
      this.close({ returnFocus: false });
    } else {
      this.open();
    }
  }

  open() {
    if (this.disabled()) {
      return;
    }

    const today = Temporal.Now.plainDateISO().toString();

    this.today.set(today);
    this.monthSwapPhase.set('idle');
    this.pendingView = undefined;
    this.focusAfterMonthSwap = false;
    this.view.set((parseInputDate(this.value()) ?? parseInputDate(today)!).toPlainYearMonth());
    this.popupExpanded.set(true);
  }

  close(options: { returnFocus?: boolean } = {}) {
    if (!this.popupExpanded()) {
      return;
    }

    this.popupExpanded.set(false);
    this.touch.emit();

    if (options.returnFocus !== false) {
      queueMicrotask(() => this.trigger()?.nativeElement.focus());
    }
  }

  reset() {
    this.value.set('');
    this.close();
  }

  setToday() {
    const today = this.today();

    if (!this.isDateAllowed(today)) {
      return;
    }

    this.value.set(today);
    this.view.set(parseInputDate(today)!.toPlainYearMonth());
    this.close();
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

    this.finishTriggerSwap();
  }

  onMonthTransitionEnd(event: TransitionEvent) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'opacity' ||
      this.monthSwapPhase() !== 'exit' ||
      !this.pendingView
    ) {
      return;
    }

    this.finishMonthSwap();
  }

  onDaySelectionChange(day: CalendarDay, selected: boolean) {
    if (!selected || day.disabled || !day.inCurrentMonth) {
      return;
    }

    this.value.set(day.date);
    this.close();
  }

  onPanelToggle(event: ToggleEvent) {
    if (event.newState !== 'closed' || !this.popupExpanded()) {
      return;
    }

    this.popupExpanded.set(false);
    this.touch.emit();
  }

  onPanelKeydown(event: KeyboardEvent) {
    // Home/End belong to the Angular Aria grid's row navigation. This panel only
    // layers calendar-specific month/year shortcuts on top of that keyboard model.
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
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

  private shiftView(months: number, withFocus = true) {
    if (this.monthSwapPhase() === 'exit') {
      return;
    }

    this.transitionToView((this.pendingView ?? this.view()).add({ months }), withFocus);
  }

  private transitionToView(nextView: Temporal.PlainYearMonth, withFocus: boolean) {
    const currentView = this.view();
    nextView = this.clampViewToBounds(nextView);

    if (nextView.equals(currentView)) {
      if (withFocus) {
        queueMicrotask(() => this.focusInitialCell());
      }

      return;
    }

    this.pendingView = nextView;
    this.focusAfterMonthSwap = withFocus;
    this.monthSwapDirection.set(
      Temporal.PlainYearMonth.compare(nextView, currentView) < 0 ? 'previous' : 'next',
    );
    this.monthSwapPhase.set('exit');
  }

  private finishTriggerSwap(): void {
    if (this.triggerSwapPhase() !== 'exit') {
      return;
    }

    this.displayedTriggerValue.set(this.pendingTriggerValue);
    this.displayedTriggerPlaceholder.set(this.pendingTriggerPlaceholder);
    this.triggerSwapPhase.set('enter-start');
  }

  private finishMonthSwap(): void {
    if (this.monthSwapPhase() !== 'exit' || !this.pendingView) {
      return;
    }

    this.view.set(this.pendingView);
    this.monthSwapPhase.set('enter-start');
  }

  private clampViewToBounds(view: Temporal.PlainYearMonth): Temporal.PlainYearMonth {
    const minMonth = parseInputDate(this.min() ?? '')?.toPlainYearMonth();
    const maxMonth = parseInputDate(this.max() ?? '')?.toPlainYearMonth();

    if (minMonth && Temporal.PlainYearMonth.compare(view, minMonth) < 0) {
      return minMonth;
    }

    if (maxMonth && Temporal.PlainYearMonth.compare(view, maxMonth) > 0) {
      return maxMonth;
    }

    return view;
  }

  private focusInitialCell() {
    const panel = this.panel()?.nativeElement;
    const target =
      panel?.querySelector<HTMLElement>('td[data-focus-target="true"]') ??
      panel?.querySelector<HTMLElement>('td[tabindex="0"]');

    target?.focus();
    this.grid()?.scrollActiveCellIntoView({ block: 'nearest', inline: 'nearest' });
  }

  private isDateAllowed(date: string) {
    const selectedDate = parseInputDate(date);

    if (!selectedDate) {
      return false;
    }

    const min = parseInputDate(this.min() ?? '');
    const max = parseInputDate(this.max() ?? '');

    return (
      (!min || Temporal.PlainDate.compare(selectedDate, min) >= 0) &&
      (!max || Temporal.PlainDate.compare(selectedDate, max) <= 0)
    );
  }
}
