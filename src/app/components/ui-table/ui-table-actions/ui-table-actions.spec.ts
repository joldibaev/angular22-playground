import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTableActions } from './ui-table-actions';

@Component({
  imports: [UiTableActions],
  template: `<table><tbody><tr><td uiTableActions><button>Edit</button></td></tr></tbody></table>`,
})
class TestHost {}

describe('UiTableActions', () => {
  it('provides the stable action-cell styling hook', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('td').classList.contains('ui-table-actions')).toBe(
      true,
    );
  });
});
