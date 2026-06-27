import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UiTable } from '../ui-table';
import type { UiTableSortDirection } from '../ui-table.types';

@Component({
  selector: 'th[uiTableSort]',
  templateUrl: './ui-table-sort.html',
  styleUrl: './ui-table-sort.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-table-sort',
    scope: 'col',
    '[attr.aria-sort]': 'ariaSort()',
  },
})
export class UiTableSort {
  readonly column = input.required<string>({ alias: 'uiTableSort' });
  readonly ascValue = input<string>();
  readonly descValue = input<string>();
  readonly startDirection = input<UiTableSortDirection>('asc');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  private readonly table = inject(UiTable);

  private readonly ascendingValue = computed(() => this.ascValue() ?? `${this.column()}-asc`);
  private readonly descendingValue = computed(() => this.descValue() ?? `${this.column()}-desc`);

  readonly active = computed(() => {
    const sort = this.table.sort();
    return sort === this.ascendingValue() || sort === this.descendingValue();
  });
  readonly direction = computed<UiTableSortDirection>(() => {
    const sort = this.table.sort();

    if (sort === this.descendingValue()) {
      return 'desc';
    }

    return sort === this.ascendingValue() ? 'asc' : this.startDirection();
  });
  protected readonly ariaSort = computed<'ascending' | 'descending' | 'none'>(() => {
    if (!this.active()) {
      return 'none';
    }

    return this.direction() === 'asc' ? 'ascending' : 'descending';
  });

  protected toggle(): void {
    this.table.toggleSort(
      this.ascendingValue(),
      this.descendingValue(),
      this.startDirection(),
    );
  }
}
