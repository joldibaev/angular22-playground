import { TableShowcaseMockService } from './table-showcase-mock.service';

describe('TableShowcaseMockService', () => {
  let service: TableShowcaseMockService;

  beforeEach(() => {
    service = new TableShowcaseMockService();
  });

  it('returns deterministic paged inventory data', async () => {
    const page = await service.queryInventory({ offset: 120 }, { latencyMs: 0 });

    expect(page.total).toBe(10_000);
    expect(page.rows).toHaveLength(120);
    expect(page.rows[0].id).toBe(121);
    expect(page.offset).toBe(120);
  });

  it('filters and sorts with the same contract as a backend endpoint', async () => {
    const page = await service.queryInventory(
      {
        product: 'Matcha',
        warehouse: 'Airport',
        sort: 'retailPrice-desc',
      },
      { latencyMs: 0 },
    );

    expect(page.total).toBeGreaterThan(0);
    expect(page.rows.every((row) => row.product.includes('Matcha'))).toBe(true);
    expect(page.rows.every((row) => row.warehouse === 'Airport')).toBe(true);
    expect(page.rows[0].retailPrice).toBeGreaterThanOrEqual(page.rows[1].retailPrice);
  });

  it('persists edits and deletes until reset', async () => {
    await service.updateInventoryStorageCell(1, 'Z-99', { latencyMs: 0 });
    await service.deleteInventoryRow(2, { latencyMs: 0 });

    const changed = await service.queryInventory({ product: 'SKU-00001' }, { latencyMs: 0 });
    const deleted = await service.queryInventory({ product: 'SKU-00002' }, { latencyMs: 0 });
    expect(changed.rows[0].storageCell).toBe('Z-99');
    expect(deleted.total).toBe(0);

    service.reset();
    expect(service.initialInventoryPage({ product: 'SKU-00002' }).total).toBe(1);
  });

  it('can simulate a deterministic server failure', async () => {
    service.failNextRequest('Inventory unavailable');

    await expect(service.queryInventory({}, { latencyMs: 0 })).rejects.toThrow(
      'Inventory unavailable',
    );
    await expect(service.queryInventory({}, { latencyMs: 0 })).resolves.toBeTruthy();
  });

  it('cancels stale requests through AbortSignal', async () => {
    const controller = new AbortController();
    const request = service.queryInventory({}, { latencyMs: 1_000, signal: controller.signal });

    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
