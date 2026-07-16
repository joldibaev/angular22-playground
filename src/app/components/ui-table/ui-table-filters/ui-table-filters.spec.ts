import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTableFilters } from './ui-table-filters';

@Component({
  imports: [UiTableFilters],
  template: `<table><thead><tr uiTableFilters><th>Filter</th></tr></thead></table>`,
})
class TestHost {}

describe('UiTableFilters', () => {
  it('marks a header row as the table filter surface', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('tr').classList.contains('ui-table-filters')).toBe(
      true,
    );
  });
});
