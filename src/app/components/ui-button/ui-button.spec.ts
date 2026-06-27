import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButton } from './ui-button';

@Component({
  imports: [UiButton],
  template: `
    <button uiButton type="submit" loading>Save</button>
    <a uiButton href="/docs" disabled>Docs</a>
    <button uiButton type="button" variant="brand" iconOnly aria-label="Add">+</button>
    <button uiButton type="button" rounded>Pill</button>
  `,
})
class TestHost {}

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
  });

  it('should apply disabled state to anchor hosts accessibly', () => {
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

    anchor.dispatchEvent(clickEvent);

    expect(anchor.classList.contains('ui-button')).toBe(true);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('should apply brand and icon-only presentation modes', () => {
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Add"]',
    ) as HTMLButtonElement;

    expect(button.classList.contains('ui-button-brand')).toBe(true);
    expect(button.classList.contains('ui-button-icon-only')).toBe(true);
  });

  it('should apply the rounded (pill) shape mode', () => {
    const button = fixture.nativeElement.querySelector(
      'button[rounded]',
    ) as HTMLButtonElement;

    expect(button.classList.contains('ui-button-rounded')).toBe(true);
  });
});
