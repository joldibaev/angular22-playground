import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import {
  UiContextMenu,
  UiContextMenuSelection,
} from '../../../components/ui-context-menu/ui-context-menu';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';
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
  imports: [
    ShowcaseExample,
    UiButton,
    UiContextMenu,
    UiContextMenuTrigger,
    UiIcon,
    UiMenuItem,
    UiSkeleton,
    UiTable,
    UiTableSort,
    UiTableSpacer,
    UiTableViewport,
  ],
  templateUrl: './table-showcase.html',
  styleUrl: './table-showcase.css',
})
export class TableShowcase {
  protected readonly defaultCode = `<table uiTable>
  <caption>Inventory preview</caption>
  <thead>
    <tr>
      <th scope="col">SKU</th>
      <th scope="col">Product</th>
      <th scope="col">Stock</th>
    </tr>
  </thead>
  <tbody>
    @for (row of allRows.slice(0, 4); track row.id) {
      <tr>
        <td>{{ row.sku }}</td>
        <th scope="row">{{ row.product }}</th>
        <td>{{ row.stock }}</td>
      </tr>
    }
  </tbody>
</table>`;
  protected readonly presentationCode = `<div uiTableViewport>
  <table uiTable withStripedRows withRowHover>
    <caption>Inventory presentation</caption>
    <thead>
      <tr>
        <th scope="col">SKU</th>
        <th scope="col">Product</th>
        <th scope="col">Warehouse</th>
      </tr>
    </thead>
    <tbody>
      @for (row of allRows.slice(0, 10); track row.id) {
        <tr>
          <td>{{ row.sku }}</td>
          <th scope="row">{{ row.product }}</th>
          <td>{{ row.warehouse }}</td>
        </tr>
      }
    </tbody>
  </table>
</div>`;
  protected readonly sortCode = `<table uiTable [sort]="sort()" (sortChange)="requestSortedPage($event)">
  <thead>
    <tr>
      <th scope="col" uiTableSort="product">Product</th>
      <th scope="col" uiTableSort="stock" startDirection="desc">Stock</th>
    </tr>
  </thead>
  <tbody>
    @for (row of rows; track row.id) {
      <tr>
        <th scope="row">{{ row.product }}</th>
        <td>{{ row.stock }}</td>
      </tr>
    }
  </tbody>
</table>`;
  protected readonly contextMenuCode = `<tr
  tabindex="0"
  [uiContextMenuTrigger]="rowMenu"
  [uiContextMenuContext]="row"
>
  <td>{{ row.sku }}</td>
  <th scope="row">{{ row.product }}</th>
  <td>{{ row.warehouse }}</td>
  <td>{{ row.stock }}</td>
</tr>

<ui-context-menu #rowMenu (itemSelected)="runRowAction($event)">
  <ui-menu-item value="open">Open details</ui-menu-item>
  <ui-menu-item value="duplicate">
    <ui-icon slot="start" name="outline-copy" decorative />
    <span>Duplicate row</span>
  </ui-menu-item>
  <ui-menu-item value="delete" variant="destructive">
    <ui-icon slot="start" name="outline-trash" decorative />
    <span>Delete row</span>
  </ui-menu-item>
</ui-context-menu>`;
  protected readonly virtualCode = `<div uiTableViewport>
  <table
    #table="uiTable"
    uiTable
    virtualScroll
    [rows]="rows()"
    [rowHeight]="48"
    [totalRows]="totalRows"
    [loading]="loading()"
    [hasMore]="rows().length < totalRows"
    (endReached)="loadMore()"
  >
    <tbody>
      <tr uiTableSpacer="start" [columns]="4"></tr>
      @for (row of table.renderedRows(); track row.id) {
        <tr>
          <td>{{ row.sku }}</td>
          <th scope="row">{{ row.product }}</th>
          <td>{{ row.warehouse }}</td>
          <td>{{ row.stock }}</td>
        </tr>
      }
      <tr uiTableSpacer="end" [columns]="4"></tr>
      @if (loading()) {
        @for (_ of loadingSkeletonRows; track $index) {
          <tr aria-hidden="true">
            <td><ui-skeleton /></td>
            <th scope="row"><ui-skeleton /></th>
            <td><ui-skeleton /></td>
            <td><ui-skeleton /></td>
          </tr>
        }
      }
    </tbody>
  </table>
</div>`;
  protected readonly allRows = ALL_ROWS;
  protected readonly sort = signal<string | null>(null);
  protected readonly sortedRows = signal<readonly InventoryRow[]>(ALL_ROWS.slice(0, 10));
  protected readonly sorting = signal(false);
  protected readonly loadedRows = signal<readonly InventoryRow[]>(ALL_ROWS.slice(0, 80));
  protected readonly loading = signal(false);
  protected readonly loadingSkeletonRows = [0, 1, 2] as const;
  protected readonly lastAction = signal<string | null>(null);

  protected requestSortedPage(sort: string | null): void {
    this.sort.set(sort);
    this.sorting.set(true);

    queueMicrotask(() => {
      this.sortedRows.set(mockBackendPage(sort));
      this.sorting.set(false);
    });
  }

  protected openProduct(row: InventoryRow): void {
    this.lastAction.set(row.product);
  }

  protected runRowAction(selection: UiContextMenuSelection<unknown>): void {
    if (!isInventoryRow(selection.context)) {
      return;
    }

    this.lastAction.set(`${selection.value}: ${selection.context.product}`);
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

  protected scrollToEnd(table: UiTable<InventoryRow>): void {
    table.scrollToIndex(this.loadedRows().length - 1, 'smooth');
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

function isInventoryRow(value: unknown): value is InventoryRow {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'product' in value &&
    typeof value.product === 'string'
  );
}
