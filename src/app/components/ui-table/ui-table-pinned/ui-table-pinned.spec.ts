import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTablePinned } from './ui-table-pinned';

@Component({
  imports: [UiTablePinned],
  template: `<table><tbody><tr><td uiTablePinned="end" [offset]="12">Actions</td></tr></tbody></table>`,
})
class TestHost {}

describe('UiTablePinned', () => {
  it('marks the pinned edge and publishes its offset', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const cell = fixture.nativeElement.querySelector('td') as HTMLTableCellElement;

    expect(cell.classList.contains('ui-table-pinned-end')).toBe(true);
    expect(cell.style.getPropertyValue('--ui-table-pinned-offset')).toBe('12px');
  });
});
