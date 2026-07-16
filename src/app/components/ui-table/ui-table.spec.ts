import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiTable } from './ui-table';
import { UiTableFilters } from './ui-table-filters/ui-table-filters';
import { UiTableSort } from './ui-table-sort/ui-table-sort';
import { UiTableSpacer } from './ui-table-spacer/ui-table-spacer';
import type { UiTableEndReachedEvent } from './ui-table.types';
import { UiTableViewport } from './ui-table-viewport/ui-table-viewport';

interface TestRow {
  readonly id: number;
  readonly name: string;
}

@Component({
  imports: [UiTable, UiTableFilters, UiTableSort, UiTableSpacer, UiTableViewport],
  template: `
    <div uiTableViewport>
      <table
        #table="uiTable"
        uiTable
        density="compact"
        virtualScroll
        withStripedRows
        [rows]="rows()"
        [overscan]="1"
        [endThreshold]="1"
        [totalRows]="totalRows()"
        [loading]="loading()"
        [hasMore]="hasMore()"
        [(sort)]="sort"
        (endReached)="endEvents.push($event)"
      >
        <caption>
          Products
        </caption>
        <thead>
          <tr>
            <th scope="colgroup" colspan="2">Product</th>
            <th scope="col" rowspan="2">Status</th>
          </tr>
          <tr>
            <th scope="col" uiTableSort="name">Name</th>
            <th scope="col">ID</th>
          </tr>
          <tr uiTableFilters>
            <th colspan="3">Filters</th>
          </tr>
        </thead>
        <tbody>
          <tr uiTableSpacer="start" [columns]="3"></tr>
          @for (row of table.renderedRows(); track row.id) {
            <tr>
              <th scope="row">{{ row.name }}</th>
              <td>{{ row.id }}</td>
              <td>Active</td>
            </tr>
          }
          <tr uiTableSpacer="end" [columns]="3"></tr>
        </tbody>
      </table>
    </div>
  `,
})
class TestHost {
  readonly rows = signal<readonly TestRow[]>(createRows(100));
  readonly sort = signal<string | null>(null);
  readonly hasMore = signal(true);
  readonly loading = signal(false);
  readonly totalRows = signal<number | undefined>(100);
  readonly endEvents: UiTableEndReachedEvent[] = [];
}

describe('UiTable', () => {
  let fixture: ComponentFixture<TestHost>;
  let viewportElement: HTMLElement;
  let table: UiTable<TestRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();

    viewportElement = fixture.nativeElement.querySelector('[uiTableViewport]');
    table = fixture.debugElement.query(By.directive(UiTable)).componentInstance;
    Object.defineProperty(viewportElement, 'clientHeight', { configurable: true, value: 120 });
  });

  it('keeps native table semantics and reports the virtual total', () => {
    const tableElement = fixture.nativeElement.querySelector('table') as HTMLTableElement;

    expect(tableElement.caption?.textContent).toContain('Products');
    expect(
      tableElement.querySelector<HTMLTableCellElement>('th[scope="colgroup"]')?.colSpan,
    ).toBe(2);
    expect(tableElement.querySelector<HTMLTableCellElement>('th[rowspan]')?.rowSpan).toBe(2);
    expect(tableElement.querySelector('th[scope="col"]')).toBeTruthy();
    expect(tableElement.classList.contains('ui-table-density-compact')).toBe(true);
    expect(table.safeRowHeight()).toBe(40);
    expect(tableElement.getAttribute('aria-rowcount')).toBe('103');
    expect(tableElement.tHead?.rows[0].getAttribute('aria-rowindex')).toBe('1');
    expect(tableElement.tHead?.rows[1].getAttribute('aria-rowindex')).toBe('2');
    expect(tableElement.tHead?.rows[2].getAttribute('aria-rowindex')).toBe('3');
  });

  it('renders the visible window with automatic spacer geometry', async () => {
    viewportElement.scrollTop = 400;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    expect(table.renderedRange()).toEqual({ start: 9, end: 14 });
    expect(table.renderedRows().map((row) => row.id)).toEqual([10, 11, 12, 13, 14]);

    const spacers = fixture.nativeElement.querySelectorAll('.ui-table-spacer td');
    const bodyRows = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLTableRowElement>(
        'tbody tr:not(.ui-table-spacer)',
      ),
    );
    expect(spacers[0].style.height).toBe('360px');
    expect(spacers[1].style.height).toBe('3440px');
    expect(bodyRows.map((row) => row.getAttribute('aria-rowindex'))).toEqual([
      '13',
      '14',
      '15',
      '16',
      '17',
    ]);
    expect(bodyRows.map((row) => row.classList.contains('ui-table-row-striped'))).toEqual([
      true,
      false,
      true,
      false,
      true,
    ]);
  });

  it('cycles sorting intent without mutating the supplied data', async () => {
    const sortButton = fixture.nativeElement.querySelector(
      '.ui-table-sort-trigger',
    ) as HTMLButtonElement;

    sortButton.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.sort()).toBe('name-asc');

    sortButton.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.sort()).toBe('name-desc');

    sortButton.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.sort()).toBeNull();
    expect(fixture.componentInstance.rows()[0].id).toBe(1);
  });

  it('emits endReached once per loaded row count', async () => {
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(fixture.componentInstance.endEvents).toEqual([{ loadedRows: 100, renderedEnd: 100 }]);

    viewportElement.scrollTop = 0;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(fixture.componentInstance.endEvents).toHaveLength(1);

    table.resetVirtualScroll();
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(fixture.componentInstance.endEvents).toHaveLength(2);

    fixture.componentInstance.rows.set(createRows(120));
    viewportElement.scrollTop = 4_640;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(fixture.componentInstance.endEvents.at(-1)).toEqual({
      loadedRows: 120,
      renderedEnd: 120,
    });
  });

  it('does not request another page when the data source has no more rows', async () => {
    fixture.componentInstance.hasMore.set(false);
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    expect(fixture.componentInstance.endEvents).toHaveLength(0);
  });

  it('does not request another page while a page is loading', async () => {
    fixture.componentInstance.loading.set(true);
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    expect(fixture.componentInstance.endEvents).toHaveLength(0);
  });

  it('reports an unknown total while more rows may exist', async () => {
    fixture.componentInstance.totalRows.set(undefined);
    await fixture.whenStable();
    const tableElement = fixture.nativeElement.querySelector('table') as HTMLTableElement;

    expect(tableElement.getAttribute('aria-rowcount')).toBe('-1');

    fixture.componentInstance.hasMore.set(false);
    await fixture.whenStable();
    expect(tableElement.getAttribute('aria-rowcount')).toBe('103');
  });

  it('clamps the rendered range after the data source shrinks', async () => {
    viewportElement.scrollTop = 3_840;
    viewportElement.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    fixture.componentInstance.rows.set(createRows(10));
    await fixture.whenStable();

    expect(table.renderedRange()).toEqual({ start: 6, end: 10 });
    expect(table.renderedRows().map((row) => row.id)).toEqual([7, 8, 9, 10]);
  });
});

function createRows(count: number): TestRow[] {
  return Array.from({ length: count }, (_, index) => ({ id: index + 1, name: `Row ${index + 1}` }));
}
