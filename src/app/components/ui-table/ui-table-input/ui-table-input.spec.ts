import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTableInput } from './ui-table-input';

@Component({
  imports: [UiTableInput],
  template: `
    <ui-table-input
      ariaLabel="Product filter"
      placeholder="Search"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [(value)]="value"
      (touch)="touches++"
    />
  `,
})
class TestHost {
  readonly value = signal('Arabica');
  readonly disabled = signal(false);
  readonly invalid = signal(false);
  touches = 0;
}

describe('UiTableInput', () => {
  it('exposes a compact accessible native input and updates its value', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.value).toBe('Arabica');
    expect(input.getAttribute('aria-label')).toBe('Product filter');

    input.value = 'Matcha';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('Matcha');

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.touches).toBe(1);
  });

  it('reflects disabled and invalid states', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();

    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
