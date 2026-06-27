import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiTable } from '../../../components/ui-table/ui-table';
import { UiTableSort } from '../../../components/ui-table/ui-table-sort/ui-table-sort';
import { UiTableSpacer } from '../../../components/ui-table/ui-table-spacer/ui-table-spacer';
import { UiTableViewport } from '../../../components/ui-table/ui-table-viewport/ui-table-viewport';

interface InventoryRow {
  readonly id: number;
  readonly sku: string;
  readonly product: string;
  readonly warehouse: string;
  readonly stock: number;
  readonly reserved: number;
}

const PRODUCTS = ['Arabica', 'Matcha', 'Olive oil', 'Protein bar', 'Sparkling water'];
const WAREHOUSES = ['Central', 'Airport', 'Market'];
const ALL_ROWS = Array.from({ length: 500 }, (_, index): InventoryRow => ({
  id: index + 1,
  sku: `SKU-${String(index + 1).padStart(4, '0')}`,
  product: `${PRODUCTS[index % PRODUCTS.length]} ${index + 1}`,
  warehouse: WAREHOUSES[index % WAREHOUSES.length],
  stock: 8 + ((index * 17) % 240),
  reserved: (index * 7) % 32,
}));

@Component({
  selector: 'app-table-showcase',
  imports: [UiButton, UiTable, UiTableSort, UiTableSpacer, UiTableViewport],
  templateUrl: './table-showcase.html',
})
export class TableShowcase {
  protected readonly allRows = ALL_ROWS;
  protected readonly sort = signal<string | null>(null);
  protected readonly previewRows = signal<readonly InventoryRow[]>(ALL_ROWS.slice(0, 10));
  protected readonly sorting = signal(false);
  protected readonly loadedRows = signal<readonly InventoryRow[]>(ALL_ROWS.slice(0, 80));
  protected readonly loading = signal(false);
  protected readonly lastAction = signal<string | null>(null);

  protected requestSortedPage(sort: string | null): void {
    this.sort.set(sort);
    this.sorting.set(true);

    queueMicrotask(() => {
      this.previewRows.set(mockBackendPage(sort));
      this.sorting.set(false);
    });
  }

  protected openProduct(row: InventoryRow): void {
    this.lastAction.set(row.product);
  }

  protected loadMore(): void {
    const loaded = this.loadedRows().length;

    if (this.loading() || loaded >= ALL_ROWS.length) {
      return;
    }

    this.loading.set(true);
    queueMicrotask(() => {
      this.loadedRows.set(ALL_ROWS.slice(0, Math.min(loaded + 80, ALL_ROWS.length)));
      this.loading.set(false);
    });
  }
}

// Showcase-only stand-in for the endpoint response. The table emits sort intent but never sorts data.
function mockBackendPage(sort: string | null): readonly InventoryRow[] {
  const rows = ALL_ROWS.slice();

  if (sort) {
    const separator = sort.lastIndexOf('-');
    const column = sort.slice(0, separator) as keyof InventoryRow;
    const direction = sort.slice(separator + 1);

    rows.sort((first, second) => {
      const result = compareValues(first[column], second[column]);
      return direction === 'asc' ? result : -result;
    });
  }

  return rows.slice(0, 10);
}

function compareValues(first: string | number, second: string | number): number {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second));
}
