import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButton } from './ui-button';

@Component({
  imports: [UiButton],
  template: `
    <button
      uiButton
      type="submit"
      [loading]="loading()"
    >
      Save
    </button>
    <a uiButton href="/docs" disabled>Docs</a>
    <a id="invalid-anchor" uiButton>Not a link</a>
    <button uiButton type="button" variant="brand" iconOnly aria-label="Add">+</button>
    <button uiButton type="button" rounded>Pill</button>
    <button uiButton type="button" size="sm">Small</button>
    <button uiButton type="button" fluid>Fluid</button>
  `,
})
class TestHost {
  readonly loading = signal(true);
}

describe('UiButton', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should apply button state to native button hosts', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList.contains('ui-button')).toBe(true);
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('ui-loading')).toBeTruthy();
    const state = button.querySelector('.ui-button-state') as HTMLElement;
    const content = button.querySelector('.ui-button-content') as HTMLElement;
    const spinner = button.querySelector('.ui-button-loading-indicator') as HTMLElement;
    expect(content.textContent).toContain('Save');
    expect(state.dataset['loading']).toBe('true');
    expect(getComputedStyle(content).visibility).toBe('hidden');
    expect(getComputedStyle(spinner).position).toBe('absolute');
    expect(getComputedStyle(spinner).translate).toBe('-50% -50%');
  });

  it('should swap content and loading indicator through exit and enter phases', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const state = button.querySelector('.ui-button-state') as HTMLElement;

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();

    expect(state.dataset['swapPhase']).toBe('exit');
    const transitionEnd = new Event('transitionend');
    Object.defineProperty(transitionEnd, 'propertyName', { value: 'opacity' });
    state.dispatchEvent(transitionEnd);
    fixture.detectChanges();

    expect(state.dataset['loading']).toBe('false');
    expect(button.querySelector('.ui-button-loading-indicator')).toBeNull();
  });

  it('should apply disabled state to anchor hosts accessibly', () => {
    const anchor = fixture.nativeElement.querySelector('a[href]') as HTMLAnchorElement;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

    anchor.dispatchEvent(clickEvent);

    expect(anchor.classList.contains('ui-button')).toBe(true);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('should not enhance anchors without href as buttons', () => {
    const anchor = fixture.nativeElement.querySelector('#invalid-anchor') as HTMLAnchorElement;

    expect(anchor.classList.contains('ui-button')).toBe(false);
    expect(anchor.querySelector('.ui-button-state')).toBeNull();
  });

  it('should apply brand and icon-only presentation modes', () => {
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Add"]',
    ) as HTMLButtonElement;

    expect(button.classList.contains('ui-button-brand')).toBe(true);
    expect(button.classList.contains('ui-button-icon-only')).toBe(true);
  });

  it('should apply the rounded (pill) shape mode', () => {
    const button = fixture.nativeElement.querySelector('button[rounded]') as HTMLButtonElement;

    expect(button.classList.contains('ui-button-rounded')).toBe(true);
  });

  it('should apply the compact size modifier', () => {
    const button = fixture.nativeElement.querySelector('button[size="sm"]') as HTMLButtonElement;

    expect(button.classList.contains('ui-button-sm')).toBe(true);
  });

  it('should apply the fluid width modifier', () => {
    const button = fixture.nativeElement.querySelector('button[fluid]') as HTMLButtonElement;

    expect(button.classList.contains('ui-button-fluid')).toBe(true);
    expect(getComputedStyle(button).width).toBe('100%');
  });
});
