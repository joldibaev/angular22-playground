import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTableInputNumber } from './ui-table-input-number';

@Component({
  imports: [UiTableInputNumber],
  template: `
    <ui-table-input-number
      ariaLabel="Quantity"
      [min]="1"
      [max]="3"
      [(value)]="value"
      (touch)="touches++"
    />
  `,
})
class TestHost {
  readonly value = signal(2);
  touches = 0;
}

describe('UiTableInputNumber', () => {
  it('increments and decrements while preserving an accessible label', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-label')).toBe('Quantity');
    buttons[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(3);
    expect(buttons[1].disabled).toBe(true);

    buttons[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(2);
  });

  it('clamps typed values to the allowed range', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = '12';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe(3);

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.touches).toBe(1);
  });
});
