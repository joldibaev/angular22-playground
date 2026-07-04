import { TestBed } from '@angular/core/testing';
import { UiTableViewport } from './ui-table-viewport';

describe('UiTableViewport', () => {
  it('accepts pixel and CSS lengths without measuring layout in JavaScript', async () => {
    const fixture = TestBed.createComponent(UiTableViewport);
    fixture.componentRef.setInput('height', 320);
    await fixture.whenStable();

    expect(fixture.nativeElement.style.getPropertyValue('--ui-table-viewport-height')).toBe(
      '320px',
    );

    fixture.componentRef.setInput('height', '50dvh');
    await fixture.whenStable();
    expect(fixture.nativeElement.style.getPropertyValue('--ui-table-viewport-height')).toBe(
      '50dvh',
    );
  });
});
