import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiNativeSelect } from './ui-native-select';

@Component({
  imports: [UiNativeSelect],
  template: `
    <ui-native-select
      [(value)]="value"
      label="Status"
      placeholder="Choose status"
      [disabled]="disabled()"
      [loading]="loading()"
    >
      <span slot="start" aria-hidden="true">S</span>
      <span slot="end" class="projected-end">End</span>
      <option value="created"><span>Created</span></option>
      <option value="approved">Approved</option>
    </ui-native-select>
  `,
})
class TestHost {
  readonly value = signal('created');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly select = viewChild.required(UiNativeSelect);
}

describe('UiNativeSelect', () => {
  let fixture: ComponentFixture<TestHost>;
  let control: HTMLSelectElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    control = fixture.nativeElement.querySelector('select');
  });

  it('renders a labelled native select with projected options', () => {
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const field = fixture.nativeElement.querySelector('ui-field-error') as HTMLElement;
    const options = Array.from(control.options);
    const style = getComputedStyle(control);

    expect(label.textContent).toContain('Status');
    expect(label.htmlFor).toBe(control.id);
    expect(field.style.anchorName).toContain('--ui-native-select-trigger');
    expect(style.display).toBe('flex');
    expect(style.alignItems).toBe('center');
    expect(fixture.nativeElement.querySelector('.ui-native-select-chevron')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.ui-native-select-end .projected-end'),
    ).not.toBeNull();
    expect(options.map((option) => option.value)).toEqual(['', 'created', 'approved']);
    expect(options[0].textContent).toContain('Choose status');
    expect(control.value).toBe('created');
  });

  it('updates the value model through the native change event', async () => {
    control.value = 'approved';
    control.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('approved');
  });

  it('forwards disabled state and resets to the placeholder', async () => {
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();

    expect(control.disabled).toBe(true);

    fixture.componentInstance.select().reset();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('');
    expect(control.value).toBe('');
  });

  it('emits touch when the native control loses focus', () => {
    const touched = vi.fn();
    fixture.componentInstance.select().touch.subscribe(touched);

    control.dispatchEvent(new FocusEvent('blur'));

    expect(touched).toHaveBeenCalledOnce();
  });

  it('replaces the chevron with the shared loading indicator', async () => {
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.ui-native-select-chevron')).toBeNull();
    expect(fixture.nativeElement.querySelector('.ui-input-loading')).not.toBeNull();
  });
});
