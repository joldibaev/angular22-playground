import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { UiTableViewport } from './ui-table-viewport/ui-table-viewport';
import type {
  UiTableDensity,
  UiTableEndReachedEvent,
  UiTableRange,
  UiTableSortDirection,
} from './ui-table.types';

const DEFAULT_ROW_HEIGHT = 48;
const DEFAULT_OVERSCAN = 6;

@Component({
  selector: 'table[uiTable]',
  exportAs: 'uiTable',
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-table',
    '[class.ui-table-virtual]': 'virtualScroll()',
    '[class.ui-table-compact]': "density() === 'compact'",
    '[class.ui-table-with-row-hover]': 'withRowHover()',
    '[class.ui-table-with-sticky-header]': 'withStickyHeader()',
    '[style.--ui-table-row-height.px]': 'safeRowHeight()',
    '[attr.aria-busy]': "loading() ? 'true' : null",
    '[attr.aria-rowcount]': 'ariaRowCount()',
  },
})
export class UiTable<T> {
  readonly data = input<readonly T[]>([]);
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly rowHeight = input(DEFAULT_ROW_HEIGHT, { transform: numberAttribute });
  readonly overscan = input(DEFAULT_OVERSCAN, { transform: numberAttribute });
  readonly endThreshold = input(DEFAULT_OVERSCAN, { transform: numberAttribute });
  readonly totalRows = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  });
  readonly headerRows = input(1, { transform: numberAttribute });
  readonly density = input<UiTableDensity>('comfortable');
  // Refreshing does not make already-rendered rows unavailable. Loading marks the table busy and
  // suppresses duplicate pagination requests while preserving reading, scrolling, and selection.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly hasMore = input(true, { transform: booleanAttribute });
  readonly withRowHover = input(false, { transform: booleanAttribute });
  readonly withStickyHeader = input(true, { transform: booleanAttribute });
  readonly withSortReset = input(true, { transform: booleanAttribute });

  // Values are backend-ready strings supplied by sort headers. The table publishes intent and
  // never silently mutates or copies the data returned by the endpoint.
  readonly sort = model<string | null>(null);
  readonly endReached = output<UiTableEndReachedEvent>();

  private readonly viewport = inject(UiTableViewport, { optional: true });
  private lastEndReachedLength = -1;

  readonly safeRowHeight = computed(() => Math.max(1, this.rowHeight()));
  readonly visibleRange = computed<UiTableRange>(() => {
    const total = this.data().length;

    if (!this.virtualScroll()) {
      return { start: 0, end: total };
    }

    const rowHeight = this.safeRowHeight();
    const viewportHeight = this.viewport?.viewportHeight() ?? 0;
    const scrollTop = this.viewport?.scrollTop() ?? 0;
    const start = Math.max(0, Math.floor(scrollTop / rowHeight));
    const visibleRows = Math.max(1, Math.ceil(viewportHeight / rowHeight));

    return {
      start,
      end: Math.min(total, start + visibleRows),
    };
  });
  readonly renderedRange = computed<UiTableRange>(() => {
    const visible = this.visibleRange();
    const overscan = this.virtualScroll() ? Math.max(0, this.overscan()) : 0;

    return {
      start: Math.max(0, visible.start - overscan),
      end: Math.min(this.data().length, visible.end + overscan),
    };
  });
  readonly renderedRows = computed(() => {
    const range = this.renderedRange();
    return this.virtualScroll() ? this.data().slice(range.start, range.end) : this.data();
  });
  readonly topSpacerHeight = computed(() =>
    this.virtualScroll() ? this.renderedRange().start * this.safeRowHeight() : 0,
  );
  readonly bottomSpacerHeight = computed(() =>
    this.virtualScroll()
      ? Math.max(0, (this.data().length - this.renderedRange().end) * this.safeRowHeight())
      : 0,
  );
  protected readonly ariaRowCount = computed(() => {
    if (!this.virtualScroll()) {
      return null;
    }

    const bodyRows = this.totalRows() ?? this.data().length;
    return Math.max(0, bodyRows) + Math.max(0, this.headerRows());
  });

  constructor() {
    afterNextRender(() => {
      if (this.virtualScroll() && !this.viewport) {
        throw new Error('uiTable with virtualScroll must be inside a div[uiTableViewport].');
      }
    });

    effect(() => {
      const loadedRows = this.data().length;
      const range = this.renderedRange();
      const visibleRange = this.visibleRange();
      const viewportHeight = this.viewport?.viewportHeight() ?? 0;
      const nearEnd =
        this.virtualScroll() &&
        viewportHeight > 0 &&
        loadedRows > 0 &&
        loadedRows - visibleRange.end <= Math.max(0, this.endThreshold());

      if (!nearEnd) {
        this.lastEndReachedLength = -1;
        return;
      }

      if (!this.hasMore() || this.loading() || this.lastEndReachedLength === loadedRows) {
        return;
      }

      this.lastEndReachedLength = loadedRows;
      this.endReached.emit({ loadedRows, renderedEnd: range.end });
    });
  }

  rowAriaIndex(renderedIndex: number): number {
    return (
      Math.max(0, this.headerRows()) + this.renderedRange().start + Math.max(0, renderedIndex) + 1
    );
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    this.viewport?.scrollTo({
      top: Math.max(0, Math.floor(index)) * this.safeRowHeight(),
      behavior,
    });
  }

  toggleSort(
    ascendingValue: string,
    descendingValue: string,
    startDirection: UiTableSortDirection,
  ): void {
    const current = this.sort();
    const startValue = startDirection === 'asc' ? ascendingValue : descendingValue;
    const nextValue = startDirection === 'asc' ? descendingValue : ascendingValue;

    if (current !== ascendingValue && current !== descendingValue) {
      this.sort.set(startValue);
      return;
    }

    if (current === startValue) {
      this.sort.set(nextValue);
      return;
    }

    this.sort.set(this.withSortReset() ? null : startValue);
  }
}
