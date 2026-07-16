import {
  afterRenderEffect,
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  Renderer2,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { UiTableViewport } from './ui-table-viewport/ui-table-viewport';
import type {
  UiTableDensity,
  UiTableEndReachedEvent,
  UiTableRange,
  UiTableSortDirection,
} from './ui-table.types';

const DEFAULT_OVERSCAN = 6;
const DENSITY_ROW_HEIGHTS: Readonly<Record<UiTableDensity, number>> = {
  compact: 40,
  default: 48,
  touch: 56,
};

// This remains a native data table, not an ARIA grid. Adding role="grid" or Angular Aria Grid
// also commits the component to a complete managed-focus and cell-navigation model; introduce it
// only as a separate, fully designed interaction mode rather than as a semantic-only upgrade.
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
    '[class.ui-table-with-row-hover]': 'withRowHover()',
    '[class.ui-table-with-striped-rows]': 'withStripedRows()',
    '[class.ui-table-with-sticky-header]': 'withStickyHeader()',
    '[class.ui-table-density-compact]': "density() === 'compact'",
    '[class.ui-table-density-default]': "density() === 'default'",
    '[class.ui-table-density-touch]': "density() === 'touch'",
    '[style.--ui-table-row-height.px]': 'safeRowHeight()',
    '[attr.aria-busy]': "loading() ? 'true' : null",
    '[attr.aria-rowcount]': 'ariaRowCount()',
  },
})
export class UiTable<T> {
  readonly rows = input<readonly T[]>([]);
  readonly virtualScroll = input(false, { transform: booleanAttribute });
  readonly density = input<UiTableDensity>('default');
  // Density is the normal row-size source of truth so CSS and spacer math cannot drift apart.
  // Virtual rows deliberately stay uniform: measuring projected row content would require a
  // different dynamic-height virtualizer. The override is only for a genuinely custom fixed size.
  readonly rowHeight = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });
  readonly overscan = input(DEFAULT_OVERSCAN, { transform: numberAttribute });
  readonly endThreshold = input(DEFAULT_OVERSCAN, { transform: numberAttribute });
  readonly totalRows = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  });
  // The table measures <thead> by default; this override only exists for unusual projected markup.
  readonly headerRows = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });
  // Refreshing does not make already-rendered rows unavailable. Loading marks the table busy and
  // suppresses duplicate pagination requests while preserving reading, scrolling, and selection.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly hasMore = input(false, { transform: booleanAttribute });
  readonly withRowHover = input(false, { transform: booleanAttribute });
  readonly withStripedRows = input(false, { transform: booleanAttribute });
  readonly withStickyHeader = input(true, { transform: booleanAttribute });
  readonly withSortReset = input(true, { transform: booleanAttribute });

  // Values are backend-ready strings supplied by sort headers. The table publishes intent and
  // never silently mutates or copies the data returned by the endpoint.
  readonly sort = model<string | null>(null);
  readonly endReached = output<UiTableEndReachedEvent>();

  private readonly viewport = inject(UiTableViewport, { optional: true });
  private readonly elementRef = inject<ElementRef<HTMLTableElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly indexedRows = new Set<HTMLTableRowElement>();
  private readonly measuredHeaderRows = signal(1);
  private lastEndReachedLength = -1;

  readonly safeRowHeight = computed(() =>
    positiveInteger(this.rowHeight(), DENSITY_ROW_HEIGHTS[this.density()]),
  );
  private readonly safeHeaderRows = computed(() =>
    nonNegativeInteger(this.headerRows(), this.measuredHeaderRows()),
  );
  readonly visibleRange = computed<UiTableRange>(() => {
    const total = this.rows().length;

    if (!this.virtualScroll()) {
      return { start: 0, end: total };
    }

    if (total === 0) {
      return { start: 0, end: 0 };
    }

    const rowHeight = this.safeRowHeight();
    const viewportHeight = this.viewport?.viewportHeight() ?? 0;
    const scrollTop = this.viewport?.scrollTop() ?? 0;
    const maxScrollTop = Math.max(0, total * rowHeight - viewportHeight);
    const safeScrollTop = Math.min(Math.max(0, scrollTop), maxScrollTop);
    const start = Math.floor(safeScrollTop / rowHeight);
    const visibleRows = Math.max(1, Math.ceil(viewportHeight / rowHeight));

    return {
      start,
      end: Math.min(total, start + visibleRows),
    };
  });
  readonly renderedRange = computed<UiTableRange>(() => {
    const visible = this.visibleRange();
    const overscan = this.virtualScroll()
      ? nonNegativeInteger(this.overscan(), DEFAULT_OVERSCAN)
      : 0;

    return {
      start: Math.max(0, visible.start - overscan),
      end: Math.min(this.rows().length, visible.end + overscan),
    };
  });
  readonly renderedRows = computed(() => {
    const range = this.renderedRange();
    return this.virtualScroll() ? this.rows().slice(range.start, range.end) : this.rows();
  });
  readonly topSpacerHeight = computed(() =>
    this.virtualScroll() ? this.renderedRange().start * this.safeRowHeight() : 0,
  );
  readonly bottomSpacerHeight = computed(() =>
    this.virtualScroll()
      ? Math.max(0, (this.rows().length - this.renderedRange().end) * this.safeRowHeight())
      : 0,
  );
  protected readonly ariaRowCount = computed(() => {
    if (!this.virtualScroll()) {
      return null;
    }

    const totalRows = this.totalRows();

    if (totalRows === undefined || !Number.isFinite(totalRows)) {
      return this.hasMore() ? -1 : this.rows().length + this.safeHeaderRows();
    }

    const bodyRows = Math.max(this.rows().length, nonNegativeInteger(totalRows, 0));
    return bodyRows + this.safeHeaderRows();
  });

  constructor() {
    afterNextRender(() => {
      if (this.virtualScroll() && !this.viewport) {
        throw new Error('uiTable with virtualScroll must be inside an [uiTableViewport].');
      }
    });

    afterRenderEffect({
      earlyRead: () => {
        const table = this.elementRef.nativeElement;
        const virtual = this.virtualScroll();
        const rangeStart = this.renderedRange().start;
        const headerRows = table.tHead ? Array.from(table.tHead.rows) : [];
        const headerOffset =
          this.headerRows() === undefined ? headerRows.length : this.safeHeaderRows();
        const bodyRows = Array.from(table.tBodies).flatMap((body) =>
          Array.from(body.rows).filter(
            (row) => !row.classList.contains('ui-table-spacer') && row.ariaHidden !== 'true',
          ),
        );

        return { bodyRows, headerOffset, headerRows, rangeStart, virtual };
      },
      write: (renderState) => {
        const { bodyRows, headerOffset, headerRows, rangeStart, virtual } = renderState();

        if (this.headerRows() === undefined && this.measuredHeaderRows() !== headerRows.length) {
          this.measuredHeaderRows.set(headerRows.length);
        }

        for (const row of this.indexedRows) {
          this.renderer.removeAttribute(row, 'aria-rowindex');
          this.renderer.removeClass(row, 'ui-table-row-striped');
        }
        this.indexedRows.clear();

        if (!virtual) {
          return;
        }

        headerRows.forEach((row, index) => {
          this.renderer.setAttribute(row, 'aria-rowindex', String(index + 1));
          this.indexedRows.add(row);
        });

        bodyRows.forEach((row, index) => {
          const absoluteIndex = rangeStart + index;
          this.renderer.setAttribute(
            row,
            'aria-rowindex',
            String(headerOffset + absoluteIndex + 1),
          );

          if (absoluteIndex % 2 === 1) {
            this.renderer.addClass(row, 'ui-table-row-striped');
          }

          this.indexedRows.add(row);
        });
      },
    });

    effect(() => {
      const loadedRows = this.rows().length;
      const range = this.renderedRange();
      const visibleRange = this.visibleRange();
      const viewportHeight = this.viewport?.viewportHeight() ?? 0;
      const nearEnd =
        this.virtualScroll() &&
        viewportHeight > 0 &&
        loadedRows > 0 &&
        loadedRows - visibleRange.end <= nonNegativeInteger(this.endThreshold(), DEFAULT_OVERSCAN);

      if (loadedRows === 0) {
        this.lastEndReachedLength = -1;
        return;
      }

      // De-duplicate by loaded length, not by the current scroll position. Clearing this marker
      // when the user scrolls away would emit the same page request again on every return to end.
      if (
        !nearEnd ||
        !this.hasMore() ||
        this.loading() ||
        this.lastEndReachedLength === loadedRows
      ) {
        return;
      }

      this.lastEndReachedLength = loadedRows;
      this.endReached.emit({ loadedRows, renderedEnd: range.end });
    });
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    const lastIndex = Math.max(0, this.rows().length - 1);
    const safeIndex = Math.min(nonNegativeInteger(index, 0), lastIndex);

    this.viewport?.scrollTo({
      top: safeIndex * this.safeRowHeight(),
      behavior,
    });
  }

  // Sorting/filtering starts a new backend query that may return the same page length. Reset both
  // the viewport and the endReached de-duplication so that query can paginate independently.
  resetVirtualScroll(): void {
    this.lastEndReachedLength = -1;
    this.scrollToIndex(0);
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

function positiveInteger(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : fallback;
}

function nonNegativeInteger(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : fallback;
}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = numberAttribute(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
