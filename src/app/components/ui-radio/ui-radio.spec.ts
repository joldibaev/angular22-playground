import { Component, forwardRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRadio } from './ui-radio';
import { UI_RADIO_GROUP, type UiRadioGroupControl } from './ui-radio-group/ui-radio-group.token';

@Component({
  imports: [UiRadio],
  providers: [{ provide: UI_RADIO_GROUP, useExisting: forwardRef(() => TestHost) }],
  template: `<ui-radio value="priority" [label]="label()" [disabled]="radioDisabled()" />`,
})
class TestHost implements UiRadioGroupControl {
  readonly name = signal('preferences');
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly required = signal(true);
  readonly invalid = signal(false);
  readonly size = signal<'sm' | 'md'>('sm');
  readonly describedBy = signal<string | null>('preferences-help');
  readonly showErrorMessage = signal(false);
  readonly errorId = 'preferences-error';
  readonly label = signal('Priority');
  readonly radioDisabled = signal(false);
  readonly touched = signal(false);

  select(value: string): void {
    this.value.set(value);
  }

  markTouched(): void {
    this.touched.set(true);
  }
}

describe('UiRadio', () => {
  let fixture: ComponentFixture<TestHost>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should inherit group state and render its label', () => {
    const radio = fixture.nativeElement.querySelector('ui-radio') as HTMLElement;

    expect(radio.classList).toContain('ui-radio-sm');
    expect(input.name).toBe('preferences');
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('preferences-help');
    expect(input.labels?.[0]?.textContent).toContain('Priority');
  });

  it('should select its value and mark the group touched', async () => {
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('priority');
    expect(fixture.componentInstance.touched()).toBe(true);
    expect(input.checked).toBe(true);
  });

  it('should combine its disabled state with the group disabled state', async () => {
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(input.disabled).toBe(true);

    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.radioDisabled.set(true);
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
  });
});
