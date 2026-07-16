import { Injectable } from '@angular/core';

export interface InventoryRow {
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

export interface InventoryQuery {
  readonly product?: string;
  readonly warehouse?: string;
  readonly sort?: string | null;
  readonly offset?: number;
  readonly limit?: number;
}

export interface InventoryPage {
  readonly rows: readonly InventoryRow[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}

export interface TableShowcaseMockOptions {
  readonly latencyMs?: number;
  readonly signal?: AbortSignal;
}

const DEFAULT_PAGE_SIZE = 120;
const DEFAULT_LATENCY_MS = 160;
const PRODUCTS = ['Arabica', 'Matcha', 'Olive oil', 'Protein bar', 'Sparkling water'];
export const INVENTORY_WAREHOUSES = ['Central', 'Airport', 'Market'] as const;
const INVENTORY_SORT_COLUMNS = new Set<keyof InventoryRow>([
  'sku',
  'product',
  'warehouse',
  'storageCell',
  'retailPrice',
  'wholesalePrice',
  'costPrice',
  'stock',
  'reserved',
]);

// Showcase data deliberately lives behind the same request boundary as a real endpoint. Components
// exercise cancellation, filtering, sorting, paging, optimistic edits, and failures without making
// documentation reliability depend on a public placeholder API or network access.
@Injectable()
export class TableShowcaseMockService {
  private inventory = createInventory();
  private latencyMs = DEFAULT_LATENCY_MS;
  private nextFailure: Error | undefined;

  initialInventoryPage(query: InventoryQuery = {}): InventoryPage {
    return this.queryInventorySync(query);
  }

  async queryInventory(
    query: InventoryQuery = {},
    options: TableShowcaseMockOptions = {},
  ): Promise<InventoryPage> {
    await waitForMockLatency(options.latencyMs ?? this.latencyMs, options.signal);
    this.throwPendingFailure();

    return this.queryInventorySync(query);
  }

  async updateInventoryStorageCell(
    id: number,
    storageCell: string,
    options: TableShowcaseMockOptions = {},
  ): Promise<InventoryRow> {
    await waitForMockLatency(options.latencyMs ?? this.latencyMs, options.signal);
    this.throwPendingFailure();

    const index = this.inventory.findIndex((row) => row.id === id);

    if (index === -1) {
      throw new Error(`Inventory row ${id} was not found.`);
    }

    const updated = { ...this.inventory[index], storageCell };
    this.inventory[index] = updated;

    return { ...updated };
  }

  async deleteInventoryRow(
    id: number,
    options: TableShowcaseMockOptions = {},
  ): Promise<void> {
    await waitForMockLatency(options.latencyMs ?? this.latencyMs, options.signal);
    this.throwPendingFailure();

    const index = this.inventory.findIndex((row) => row.id === id);

    if (index === -1) {
      throw new Error(`Inventory row ${id} was not found.`);
    }

    this.inventory.splice(index, 1);
  }

  sampleInventoryRows(limit = 4): readonly InventoryRow[] {
    return this.inventory.slice(0, Math.max(0, limit)).map((row) => ({ ...row }));
  }

  failNextRequest(message = 'Mock server could not complete the request.'): void {
    this.nextFailure = new Error(message);
  }

  setLatency(latencyMs: number): void {
    this.latencyMs = nonNegativeInteger(latencyMs, DEFAULT_LATENCY_MS);
  }

  reset(): void {
    this.inventory = createInventory();
    this.nextFailure = undefined;
  }

  private queryInventorySync(query: InventoryQuery): InventoryPage {
    const product = query.product?.trim().toLocaleLowerCase('ru-RU') ?? '';
    const warehouse = query.warehouse ?? 'all';
    const offset = nonNegativeInteger(query.offset, 0);
    const limit = positiveInteger(query.limit, DEFAULT_PAGE_SIZE);
    let rows = this.inventory.filter(
      (row) =>
        (!product ||
          row.product.toLocaleLowerCase('ru-RU').includes(product) ||
          row.sku.toLocaleLowerCase('ru-RU').includes(product)) &&
        (warehouse === 'all' || row.warehouse === warehouse),
    );

    const sort = parseInventorySort(query.sort);

    if (sort) {
      rows = rows.slice().sort((first, second) => {
        const result = compareValues(first[sort.column], second[sort.column]);
        return sort.direction === 'asc' ? result : -result;
      });
    }

    return {
      rows: rows.slice(offset, offset + limit).map((row) => ({ ...row })),
      total: rows.length,
      offset,
      limit,
    };
  }

  private throwPendingFailure(): void {
    const failure = this.nextFailure;
    this.nextFailure = undefined;

    if (failure) {
      throw failure;
    }
  }
}

function createInventory(): InventoryRow[] {
  return Array.from({ length: 10_000 }, (_, index): InventoryRow => {
    const retailPrice = 12_000 + ((index * 1_750) % 185_000);

    return {
      id: index + 1,
      sku: `SKU-${String(index + 1).padStart(5, '0')}`,
      product: `${PRODUCTS[index % PRODUCTS.length]} ${index + 1}`,
      warehouse: INVENTORY_WAREHOUSES[index % INVENTORY_WAREHOUSES.length],
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
}

function parseInventorySort(
  sort: string | null | undefined,
): { readonly column: keyof InventoryRow; readonly direction: 'asc' | 'desc' } | undefined {
  if (!sort) {
    return undefined;
  }

  const separator = sort.lastIndexOf('-');

  if (separator === -1) {
    return undefined;
  }

  const column = sort.slice(0, separator) as keyof InventoryRow;
  const direction = sort.slice(separator + 1);

  if (!INVENTORY_SORT_COLUMNS.has(column) || (direction !== 'asc' && direction !== 'desc')) {
    return undefined;
  }

  return { column, direction };
}

function compareValues(first: string | number, second: string | number): number {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second), 'ru-RU', { numeric: true });
}

function nonNegativeInteger(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function waitForMockLatency(latencyMs: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(createAbortError());
  }

  if (latencyMs <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, latencyMs);
    const abort = () => {
      globalThis.clearTimeout(timeout);
      reject(createAbortError());
    };

    signal?.addEventListener('abort', abort, { once: true });
  });
}

function createAbortError(): DOMException {
  return new DOMException('The mock request was aborted.', 'AbortError');
}
