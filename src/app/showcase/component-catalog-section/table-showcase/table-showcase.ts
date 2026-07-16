import { Component, computed, signal, viewChild } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import {
  UiContextMenu,
  type UiContextMenuSelection,
} from '../../../components/ui-context-menu/ui-context-menu';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiInput } from '../../../components/ui-input/ui-input';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';
import { UiTable } from '../../../components/ui-table/ui-table';
import { UiTableActions } from '../../../components/ui-table/ui-table-actions/ui-table-actions';
import { UiTableFilters } from '../../../components/ui-table/ui-table-filters/ui-table-filters';
import { UiTableInput } from '../../../components/ui-table/ui-table-input/ui-table-input';
import { UiTableInputNumber } from '../../../components/ui-table/ui-table-input-number/ui-table-input-number';
import { UiTablePinned } from '../../../components/ui-table/ui-table-pinned/ui-table-pinned';
import { UiTableSort } from '../../../components/ui-table/ui-table-sort/ui-table-sort';
import { UiTableSpacer } from '../../../components/ui-table/ui-table-spacer/ui-table-spacer';
import { UiTableViewport } from '../../../components/ui-table/ui-table-viewport/ui-table-viewport';
import { ShowcaseExample } from '../showcase-example/showcase-example';

interface InventoryRow {
  readonly id: number;
  readonly sku: string;
  readonly product: string;
  readonly warehouse: string;
  readonly storageCell: string;
  readonly retailPrice: number;
  readonly wholesalePrice: number;
  readonly costPrice: number;
  readonly stock: number;
  readonly reserved: number;
}

interface CartRow {
  readonly id: number;
  readonly product: string;
  readonly sku: string;
  readonly price: number;
  readonly stock: number;
  readonly quantity: number;
}

type AsyncTableState = 'empty' | 'error' | 'incremental' | 'loading' | 'ready';

const PAGE_SIZE = 120;
const PRODUCTS = ['Arabica', 'Matcha', 'Olive oil', 'Protein bar', 'Sparkling water'];
const WAREHOUSES = ['Central', 'Airport', 'Market'];
const INVENTORY_PRICE_TYPES = [
  { key: 'retailPrice', label: 'Розничная' },
  { key: 'wholesalePrice', label: 'Оптовая' },
  { key: 'costPrice', label: 'Себестоимость' },
] as const satisfies readonly {
  readonly key: keyof Pick<InventoryRow, 'costPrice' | 'retailPrice' | 'wholesalePrice'>;
  readonly label: string;
}[];
const INVENTORY_COLUMN_COUNT = 4 + INVENTORY_PRICE_TYPES.length + 2 + 1;
const INVENTORY = Array.from({ length: 10_000 }, (_, index): InventoryRow => {
  const retailPrice = 12_000 + ((index * 1_750) % 185_000);

  return {
    id: index + 1,
    sku: `SKU-${String(index + 1).padStart(5, '0')}`,
    product: `${PRODUCTS[index % PRODUCTS.length]} ${index + 1}`,
    warehouse: WAREHOUSES[index % WAREHOUSES.length],
    storageCell: `${String.fromCharCode(65 + (index % 6))}-${String((index % 24) + 1).padStart(
      2,
      '0',
    )}`,
    retailPrice,
    wholesalePrice: Math.round((retailPrice * 0.88) / 250) * 250,
    costPrice: Math.round((retailPrice * 0.67) / 250) * 250,
    stock: 8 + ((index * 17) % 940),
    reserved: (index * 7) % 64,
  };
});
const INITIAL_INVENTORY_PAGE = queryInventory('', 'all', null, 0);
const MONEY_FORMAT = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'UZS',
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-table-showcase',
  imports: [
    ShowcaseExample,
    UiButton,
    UiContextMenu,
    UiContextMenuTrigger,
    UiIcon,
    UiInput,
    UiMenuItem,
    UiSelect,
    UiSelectOption,
    UiSkeleton,
    UiTable,
    UiTableActions,
    UiTableFilters,
    UiTableInput,
    UiTableInputNumber,
    UiTablePinned,
    UiTableSort,
    UiTableSpacer,
    UiTableViewport,
  ],
  templateUrl: './table-showcase.html',
  styleUrl: './table-showcase.css',
})
export class TableShowcase {
  protected readonly erpCode = `<div uiTableViewport>
  <table
    #table="uiTable"
    uiTable
    density="compact"
    virtualScroll
    [rows]="rows()"
    [totalRows]="totalRows()"
    [loading]="loading()"
    [hasMore]="rows().length < totalRows()"
    (endReached)="loadMore()"
  >
    <thead>
      <tr>
        <th scope="col" rowspan="2" uiTablePinned="start" uiTableSort="sku">SKU</th>
        <th scope="col" rowspan="2" uiTableSort="product">Товар</th>
        <th scope="col" rowspan="2" uiTableSort="warehouse">Склад</th>
        <th scope="col" rowspan="2">Ячейка</th>
        <th scope="colgroup" [attr.colspan]="priceTypes().length">Цена</th>
        <th scope="colgroup" colspan="2">Наличие</th>
        <th scope="col" rowspan="2" uiTablePinned="end" uiTableActions>Действия</th>
      </tr>
      <tr>
        @for (priceType of priceTypes(); track priceType.id) {
          <th scope="col" [uiTableSort]="priceType.sort">{{ priceType.name }}</th>
        }
        <th scope="col" uiTableSort="stock">Остаток</th>
        <th scope="col" uiTableSort="reserved">Резерв</th>
      </tr>
      <tr uiTableFilters>
        <td uiTablePinned="start"></td>
        <td><ui-input label="Фильтр по товару"><input type="search" /></ui-input></td>
        <td><ui-select label="Склад">...</ui-select></td>
        <td></td>
        @for (_ of priceTypes(); track $index) { <td></td> }
        <td></td><td></td>
        <td uiTablePinned="end"></td>
      </tr>
    </thead>
    <tbody>
      <tr uiTableSpacer="start" [columns]="columnCount()"></tr>
      @for (row of table.renderedRows(); track row.id) {
        <tr [uiContextMenuTrigger]="rowMenu" [uiContextMenuContext]="row">
          ...
          <td>
            <ui-table-input
              [ariaLabel]="'Storage cell for ' + row.product"
              [value]="row.storageCell"
              (valueChange)="updateStorageCell(row.id, $event)"
            />
          </td>
          ...
        </tr>
      }
      <tr uiTableSpacer="end" [columns]="columnCount()"></tr>
    </tbody>
  </table>
</div>

<ui-context-menu #rowMenu (itemSelected)="runInventoryMenuAction($event)">
  <ui-menu-item value="open">Открыть карточку</ui-menu-item>
  <ui-menu-item value="edit">Редактировать</ui-menu-item>
  <ui-menu-item value="delete" variant="destructive">Удалить</ui-menu-item>
</ui-context-menu>`;

  protected readonly posCode = `<table uiTable density="touch">
  <tbody>
    @for (row of cart(); track row.id) {
      <tr>
        <th scope="row">{{ row.product }}</th>
        <td>{{ formatMoney(row.price) }}</td>
        <td>
          <ui-table-input-number
            [ariaLabel]="'Quantity for ' + row.product"
            [value]="row.quantity"
            [min]="1"
            [max]="row.stock"
            (valueChange)="updateQuantity(row.id, $event)"
          />
        </td>
        <td>{{ formatMoney(row.price * row.quantity) }}</td>
      </tr>
    }
  </tbody>
</table>`;

  protected readonly statesCode = `readonly state = signal<'loading' | 'ready' | 'empty' | 'error' | 'incremental'>('loading');

<table uiTable [loading]="state() === 'loading' || state() === 'incremental'">
  <tbody>
    @switch (state()) {
      @case ('loading') { <!-- skeleton rows --> }
      @case ('empty') { <!-- empty state --> }
      @case ('error') { <!-- error and Retry --> }
      @default { <!-- rows; append skeletons while incremental --> }
    }
  </tbody>
</table>`;

  protected readonly inventoryRows = signal<readonly InventoryRow[]>(INITIAL_INVENTORY_PAGE.rows);
  protected readonly inventoryTotal = signal(INITIAL_INVENTORY_PAGE.total);
  protected readonly inventoryLoading = signal(false);
  protected readonly inventorySort = signal<string | null>(null);
  protected readonly productFilter = signal('');
  protected readonly warehouseFilter = signal('all');
  protected readonly inventoryAction = signal('Готово к работе');
  protected readonly skeletonRows = [0, 1, 2] as const;
  protected readonly inventoryPriceTypes = INVENTORY_PRICE_TYPES;
  protected readonly inventoryColumnCount = INVENTORY_COLUMN_COUNT;
  protected readonly inventorySkeletonColumns = Array.from(
    { length: INVENTORY_COLUMN_COUNT },
    (_, index) => index,
  );

  protected readonly cart = signal<readonly CartRow[]>([
    {
      id: 1,
      product: 'Arabica Classic 1 kg',
      sku: 'SKU-00001',
      price: 148_000,
      stock: 42,
      quantity: 2,
    },
    {
      id: 2,
      product: 'Matcha Premium 100 g',
      sku: 'SKU-00002',
      price: 92_000,
      stock: 18,
      quantity: 1,
    },
    {
      id: 3,
      product: 'Protein bar Cocoa',
      sku: 'SKU-00003',
      price: 24_000,
      stock: 64,
      quantity: 3,
    },
  ]);
  protected readonly cartTotal = computed(() =>
    this.cart().reduce((total, row) => total + row.price * row.quantity, 0),
  );

  protected readonly asyncState = signal<AsyncTableState>('loading');
  protected readonly asyncRows = INVENTORY.slice(0, 4);
  private readonly inventoryTable = viewChild<UiTable<InventoryRow>>('inventoryTable');
  private inventoryRequest = 0;

  protected refreshInventory(): void {
    const request = ++this.inventoryRequest;
    this.inventoryLoading.set(true);
    this.inventoryTable()?.resetVirtualScroll();

    queueMicrotask(() => {
      if (request !== this.inventoryRequest) {
        return;
      }

      const page = queryInventory(
        this.productFilter(),
        this.warehouseFilter(),
        this.inventorySort(),
        0,
      );
      this.inventoryRows.set(page.rows);
      this.inventoryTotal.set(page.total);
      this.inventoryLoading.set(false);
    });
  }

  protected changeInventorySort(sort: string | null): void {
    this.inventorySort.set(sort);
    this.refreshInventory();
  }

  protected loadMoreInventory(): void {
    const offset = this.inventoryRows().length;

    if (this.inventoryLoading() || offset >= this.inventoryTotal()) {
      return;
    }

    const request = this.inventoryRequest;
    this.inventoryLoading.set(true);

    queueMicrotask(() => {
      if (request !== this.inventoryRequest) {
        return;
      }

      const page = queryInventory(
        this.productFilter(),
        this.warehouseFilter(),
        this.inventorySort(),
        offset,
      );
      this.inventoryRows.update((rows) => [...rows, ...page.rows]);
      this.inventoryTotal.set(page.total);
      this.inventoryLoading.set(false);
    });
  }

  protected runInventoryAction(action: 'delete' | 'edit' | 'open', row: InventoryRow): void {
    const labels = {
      delete: 'Удаление',
      edit: 'Редактирование',
      open: 'Карточка товара',
    } as const;
    this.inventoryAction.set(`${labels[action]}: ${row.product}`);
  }

  protected runInventoryMenuAction(selection: UiContextMenuSelection<unknown>): void {
    if (!isInventoryRow(selection.context) || !isInventoryAction(selection.value)) {
      return;
    }

    this.runInventoryAction(selection.value, selection.context);
  }

  protected updateInventoryStorageCell(id: number, storageCell: string): void {
    this.inventoryRows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, storageCell } : row)),
    );
  }

  protected updateQuantity(id: number, quantity: number): void {
    this.cart.update((rows) => rows.map((row) => (row.id === id ? { ...row, quantity } : row)));
  }

  protected removeCartRow(id: number): void {
    this.cart.update((rows) => rows.filter((row) => row.id !== id));
  }

  protected setAsyncState(state: AsyncTableState): void {
    this.asyncState.set(state);
  }

  protected formatMoney(value: number): string {
    return MONEY_FORMAT.format(value);
  }
}

function queryInventory(
  productFilter: string,
  warehouseFilter: string,
  sort: string | null,
  offset: number,
): { readonly rows: readonly InventoryRow[]; readonly total: number } {
  const query = productFilter.trim().toLocaleLowerCase('ru-RU');
  let rows = INVENTORY.filter(
    (row) =>
      (!query ||
        row.product.toLocaleLowerCase('ru-RU').includes(query) ||
        row.sku.toLowerCase().includes(query)) &&
      (warehouseFilter === 'all' || row.warehouse === warehouseFilter),
  );

  if (sort) {
    const separator = sort.lastIndexOf('-');
    const column = sort.slice(0, separator) as keyof InventoryRow;
    const direction = sort.slice(separator + 1);
    rows = rows.slice().sort((first, second) => {
      const result = compareValues(first[column], second[column]);
      return direction === 'asc' ? result : -result;
    });
  }

  return {
    rows: rows.slice(offset, offset + PAGE_SIZE),
    total: rows.length,
  };
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

function isInventoryAction(value: string): value is 'delete' | 'edit' | 'open' {
  return value === 'delete' || value === 'edit' || value === 'open';
}
