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
  viewChild,
} from '@angular/core';
import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import type { FormValueControl } from '@angular/forms/signals';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiInput } from '../ui-input/ui-input';
import { syncPopover } from '../../shared/sync-popover';
import { parseInputDate, todayInputValue } from '../../shared/date.utils';
import { nextId } from '../../shared/unique-id';
import {
  addMonths,
  buildMonthGrid,
  type CalendarDay,
  type CalendarMonth,
  formatDisplayDate,
  formatMonthLabel,
  monthFromDate,
  WEEKDAYS_MON_FIRST,
} from './calendar.utils';

export type UiDatepickerSize = 'sm' | 'md';

const INITIAL_VIEW: CalendarMonth = { year: 1970, month: 0 };

// Keep the public picker single-value focused. Range picking has different
// draft/commit behavior, but both variants can share the calendar math here.
@Component({
  selector: 'ui-datepicker',
  imports: [Grid, GridCell, GridRow, UiIcon, UiInput],
  templateUrl: './ui-datepicker.html',
  // Shares the popover surface/box + open/close/flip animation with the menu and
  // select popups (ui-popup.css). The calendar overrides only the visual tokens
  // it needs in ui-datepicker.css, which loads second so its overrides win.
  styleUrls: ['../../shared/ui-popup.css', './ui-datepicker.css'],
  host: {
    '[style.anchor-scope]': 'anchorName',
  },
})
export class UiDatepicker implements FormValueControl<string> {
  private readonly id = nextId();

  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly grid = viewChild(Grid);

  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  // Loading is passive, like ui-input/select/autocomplete: existing dates remain usable while
  // availability or metadata refreshes. Consumers can bind disabled as well when truly unavailable.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly label = input('Date');
  // Forwarded to the wrapped <ui-input>; the trigger reads its control-size tokens.
  readonly size = input<UiDatepickerSize>('md');
  readonly placeholder = input('Select date');
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
  readonly view = signal<CalendarMonth>(INITIAL_VIEW);

  readonly weekdays = WEEKDAYS_MON_FIRST;
  readonly today = signal('');

  readonly displayValue = computed(() => formatDisplayDate(this.value()));
  readonly isPlaceholderVisible = computed(() => this.displayValue().length === 0);
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

  readonly canGoPrev = computed(() => {
    const min = this.min();

    if (!min) {
      return true;
    }

    const view = this.view();
    const lastDayPrevMonth = new Date(view.year, view.month, 0);

    const minDate = parseInputDate(min);

    return !minDate || lastDayPrevMonth >= minDate;
  });

  readonly canGoNext = computed(() => {
    const max = this.max();

    if (!max) {
      return true;
    }

    const view = this.view();
    const firstDayNextMonth = new Date(view.year, view.month + 1, 1);

    const maxDate = parseInputDate(max);

    return !maxDate || firstDayNextMonth <= maxDate;
  });

  constructor() {
    afterRenderEffect(() => {
      syncPopover(this.panel()?.nativeElement, this.popupExpanded());
    });

    afterRenderEffect(() => {
      if (!this.popupExpanded()) {
        return;
      }

      queueMicrotask(() => this.focusInitialCell());
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

    const today = todayInputValue();

    this.today.set(today);
    this.view.set(monthFromValue(this.value(), today));
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
    this.view.set(monthFromDate(parseInputDate(today)!));
    this.close();
  }

  previousMonth() {
    if (this.canGoPrev()) {
      this.view.update((view) => addMonths(view, -1));
    }
  }

  nextMonth() {
    if (this.canGoNext()) {
      this.view.update((view) => addMonths(view, 1));
    }
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

    if (event.key === 'Home') {
      event.preventDefault();
      this.view.set(monthFromDate(parseInputDate(this.today())!));
      queueMicrotask(() => this.focusInitialCell());
    }
  }

  focus(options?: FocusOptions) {
    this.trigger()?.nativeElement.focus(options);
  }

  private shiftView(months: number) {
    this.view.update((view) => addMonths(view, months));
    queueMicrotask(() => this.focusInitialCell());
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

    return (!min || selectedDate >= min) && (!max || selectedDate <= max);
  }
}

function monthFromValue(value: string, today: string): CalendarMonth {
  const date = parseInputDate(value) ?? parseInputDate(today)!;

  return monthFromDate(date);
}
