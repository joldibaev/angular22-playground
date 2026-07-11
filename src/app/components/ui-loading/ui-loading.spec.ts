import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiLoading } from './ui-loading';

@Component({
  imports: [UiLoading],
  template: `
    <ui-loading />
    <ui-loading label="Loading results" [size]="24" />
    <ui-loading label="Ignored label" decorative />
  `,
})
class TestHost {}

describe('UiLoading', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function indicators(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-loading'));
  }

  it('should be decorative without a label', () => {
    const [indicator] = indicators();

    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(indicator.getAttribute('aria-label')).toBeNull();
    expect(indicator.getAttribute('role')).toBe('presentation');
  });

  it('should expose a labeled loading status and configured size', () => {
    const [, indicator] = indicators();
    const svg = indicator.querySelector('svg');

    expect(indicator.getAttribute('aria-hidden')).toBeNull();
    expect(indicator.getAttribute('aria-label')).toBe('Loading results');
    expect(indicator.getAttribute('role')).toBe('status');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('should allow decorative to override a label', () => {
    const [, , indicator] = indicators();

    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(indicator.getAttribute('aria-label')).toBeNull();
    expect(indicator.getAttribute('role')).toBe('presentation');
  });

  it('should keep an explicitly non-decorative spinner hidden when it has no label', async () => {
    const unlabelled = TestBed.createComponent(UiLoading);
    unlabelled.componentRef.setInput('decorative', false);
    await unlabelled.whenStable();

    expect(unlabelled.nativeElement.getAttribute('aria-hidden')).toBe('true');
    expect(unlabelled.nativeElement.getAttribute('role')).toBe('presentation');
  });
});
