import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, form } from '@angular/forms/signals';
import { UiMask } from './ui-mask';

@Component({
  imports: [FormField, UiMask],
  template: `
    <input
      data-testid="phone"
      uiMask="+000 00 000-00-00"
      [formField]="formState.phone"
    />
    <input data-testid="reference" uiMask="UU-0000" [formField]="formState.reference" />
    <input
      data-testid="amount"
      uiMask="separator.2"
      thousandSeparator=" "
      decimalMarker="."
      [formField]="formState.amount"
    />
  `,
})
class TestHost {
  readonly model = signal({
    amount: '1250000.50',
    phone: '998901234567',
    reference: 'ab1234',
  });
  readonly formState = form(this.model);
}

function input(fixture: ComponentFixture<TestHost>, testId: string) {
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
    `[data-testid="${testId}"]`,
  )!;
}

async function typeValue(
  fixture: ComponentFixture<TestHost>,
  target: HTMLInputElement,
  value: string,
  caret = value.length,
) {
  target.value = value;
  target.setSelectionRange(caret, caret);
  target.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
}

describe('UiMask', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('formats initial form values with pattern literals and case tokens', () => {
    expect(input(fixture, 'phone').value).toBe('+998 90 123-45-67');
    expect(input(fixture, 'reference').value).toBe('AB-1234');
  });

  it('writes the normalized pattern value back to Signal Forms', async () => {
    await typeValue(fixture, input(fixture, 'reference'), 'cd9876');

    expect(input(fixture, 'reference').value).toBe('CD-9876');
    expect(fixture.componentInstance.model().reference).toBe('CD9876');
  });

  it('groups separator values and limits their decimal precision', async () => {
    const amount = input(fixture, 'amount');

    expect(amount.value).toBe('1 250 000.50');

    await typeValue(fixture, amount, '1234567.891');

    expect(amount.value).toBe('1 234 567.89');
    expect(fixture.componentInstance.model().amount).toBe('1234567.89');
  });

  it('keeps the caret at the same logical position after grouping', async () => {
    const amount = input(fixture, 'amount');

    await typeValue(fixture, amount, '1234', 4);

    expect(amount.value).toBe('1 234');
    expect(amount.selectionStart).toBe(5);
    expect(amount.selectionEnd).toBe(5);
  });

  it('waits for IME composition to finish before applying the mask', async () => {
    const reference = input(fixture, 'reference');

    reference.dispatchEvent(new Event('compositionstart', { bubbles: true }));
    reference.value = 'ef4321';
    reference.dispatchEvent(new Event('input', { bubbles: true }));

    expect(reference.value).toBe('ef4321');

    reference.dispatchEvent(new Event('compositionend', { bubbles: true }));
    await fixture.whenStable();

    expect(reference.value).toBe('EF-4321');
    expect(fixture.componentInstance.model().reference).toBe('EF4321');
  });

  it('forwards the disabled state to the native input', () => {
    const directives = fixture.debugElement.queryAll(By.directive(UiMask));
    const phone = input(fixture, 'phone');

    directives[0].injector.get(UiMask).setDisabledState(true);

    expect(phone.disabled).toBe(true);
  });
});
