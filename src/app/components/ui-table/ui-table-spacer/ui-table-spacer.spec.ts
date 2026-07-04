import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTable } from '../ui-table';
import { UiTableViewport } from '../ui-table-viewport/ui-table-viewport';
import { UiTableSpacer } from './ui-table-spacer';

@Component({
  imports: [UiTable, UiTableSpacer, UiTableViewport],
  template: `
    <div uiTableViewport>
      <table uiTable [data]="rows" virtualScroll>
        <tbody>
          <tr uiTableSpacer="start" [columns]="3"></tr>
        </tbody>
      </table>
    </div>
  `,
})
class SpacerTestHost {
  readonly rows = [1, 2, 3];
}

describe('UiTableSpacer', () => {
  it('is hidden from assistive technology and owns its colspan', async () => {
    const fixture = TestBed.createComponent(SpacerTestHost);
    await fixture.whenStable();
    const spacer = fixture.nativeElement.querySelector('tr') as HTMLTableRowElement;

    expect(spacer.getAttribute('aria-hidden')).toBe('true');
    expect(spacer.querySelector('td')?.getAttribute('colspan')).toBe('3');
  });
});
