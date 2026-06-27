import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTable } from '../ui-table';
import { UiTableSort } from './ui-table-sort';

@Component({
  imports: [UiTable, UiTableSort],
  template: `
    <table uiTable [(sort)]="sort">
      <thead>
        <tr>
          <th uiTableSort="price" ascValue="price-low" descValue="price-high">Price</th>
        </tr>
      </thead>
    </table>
  `,
})
class SortTestHost {
  readonly sort = signal<string | null>(null);
}

describe('UiTableSort', () => {
  it('puts aria-sort on the header and uses a native button trigger', async () => {
    const fixture = TestBed.createComponent(SortTestHost);
    await fixture.whenStable();
    const header = fixture.nativeElement.querySelector('th') as HTMLTableCellElement;
    const button = header.querySelector('button') as HTMLButtonElement;

    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(button.type).toBe('button');

    button.click();
    await fixture.whenStable();
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(fixture.componentInstance.sort()).toBe('price-low');
  });
});
