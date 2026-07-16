import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiTableInput } from '../../../components/ui-table/ui-table-input/ui-table-input';
import { UiTableInputNumber } from '../../../components/ui-table/ui-table-input-number/ui-table-input-number';
import { UiTablePinned } from '../../../components/ui-table/ui-table-pinned/ui-table-pinned';
import { TableShowcase } from './table-showcase';

describe('TableShowcase', () => {
  it('documents the ERP, POS, and async table scenarios', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('app-showcase-example')).toHaveLength(3);
    expect(host.textContent).toContain('ERP inventory');
    expect(host.textContent).toContain('POS cart');
    expect(host.textContent).toContain('Async states');
    expect(host.querySelectorAll('table.ui-table-density-compact')).toHaveLength(1);
    expect(host.querySelectorAll('table.ui-table-density-touch')).toHaveLength(1);
    expect(host.querySelectorAll('table.ui-table-density-default')).toHaveLength(1);
    const columnGroups = host.querySelectorAll<HTMLTableCellElement>(
      '.erp-preview thead th[scope="colgroup"]',
    );
    expect(
      Array.from(columnGroups, (header) => [header.textContent?.trim(), header.colSpan]),
    ).toEqual([
      ['Цена', 3],
      ['Наличие', 2],
    ]);
    expect(host.querySelector('.erp-preview thead th[rowspan="2"]')).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.directive(UiTablePinned)).length).toBeGreaterThan(6);
    expect(host.querySelectorAll('.ui-table-filters > td > ui-input')).toHaveLength(1);
    expect(fixture.debugElement.queryAll(By.directive(UiTableInput)).length).toBeGreaterThan(0);
    expect(fixture.debugElement.queryAll(By.directive(UiTableInputNumber))).toHaveLength(3);
    expect(fixture.debugElement.queryAll(By.directive(UiContextMenuTrigger)).length).toBeGreaterThan(
      0,
    );
    expect(host.querySelectorAll('ui-context-menu ui-menu-item')).toHaveLength(3);
  });

  it('opens the ERP row menu through the native context-menu interaction', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const row = fixture.debugElement.query(By.directive(UiContextMenuTrigger))
      .nativeElement as HTMLTableRowElement;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 24,
      clientY: 36,
    });

    row.dispatchEvent(event);
    await fixture.whenStable();

    expect(event.defaultPrevented).toBe(true);
  });

  it('filters the mock ERP endpoint and resets the loaded window', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const filter = host.querySelector('.ui-table-filters ui-input input') as HTMLInputElement;

    filter.value = 'Matcha';
    filter.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const status = host.querySelector('.erp-preview .load-status') as HTMLOutputElement;
    const rows = host.querySelectorAll(
      'app-showcase-example[aria-label="ERP virtual inventory table example"] tbody tr:not(.ui-table-spacer, .ui-table-loading-row)',
    );
    expect(status.textContent).toContain('из 2000');
    expect(Array.from(rows).every((row) => row.textContent?.includes('Matcha'))).toBe(true);
  });

  it('sorts an individual price column inside the grouped header', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const headers = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLTableCellElement>(
        '.erp-preview thead th.ui-table-sort',
      ),
    );
    const retailHeader = headers.find((header) => header.textContent?.includes('Розничная'))!;
    const sortButton = retailHeader.querySelector('button') as HTMLButtonElement;

    sortButton.click();
    await fixture.whenStable();

    expect(retailHeader.getAttribute('aria-sort')).toBe('descending');
  });

  it('edits a body cell through ui-table-input instead of using it as a filter', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const editableCell = host.querySelector(
      '.erp-preview tbody ui-table-input input',
    ) as HTMLInputElement;

    editableCell.value = 'Z-99';
    editableCell.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(editableCell.value).toBe('Z-99');
    expect(host.querySelector('.ui-table-filters ui-table-input')).toBeNull();
  });

  it('updates POS quantity and total through the number stepper', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const example = host.querySelector(
      'app-showcase-example[aria-label="POS cart table example"]',
    ) as HTMLElement;
    const total = example.querySelector('.pos-total') as HTMLTableCellElement;
    const totalBefore = total.textContent;
    const increment = example.querySelector(
      'ui-table-input-number button:last-child',
    ) as HTMLButtonElement;

    increment.click();
    await fixture.whenStable();

    expect(total.textContent).not.toBe(totalBefore);
  });

  it('switches between deterministic async table states', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const example = host.querySelector(
      'app-showcase-example[aria-label="Table asynchronous states example"]',
    ) as HTMLElement;
    const buttons = Array.from(example.querySelectorAll<HTMLButtonElement>('.state-controls button'));
    const empty = buttons.find((button) => button.textContent?.includes('Empty'))!;
    const error = buttons.find((button) => button.textContent?.includes('Error'))!;

    empty.click();
    await fixture.whenStable();
    expect(example.textContent).toContain('Записей пока нет');

    error.click();
    await fixture.whenStable();
    expect(example.textContent).toContain('Не удалось загрузить данные');
    expect(example.textContent).toContain('Повторить');
  });
});
