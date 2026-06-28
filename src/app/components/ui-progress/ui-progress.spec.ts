import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiProgress } from './ui-progress';

@Component({
  imports: [UiProgress],
  template: `
    <ui-progress label="Upload progress" value="40" max="200" />
    <ui-progress label="Loading report" />
    <ui-progress label="Duplicated progress" value="120" decorative />
  `,
})
class TestHost {}

describe('UiProgress', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function indicators(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-progress'));
  }

  it('should render labeled native determinate progress', () => {
    const [indicator] = indicators();
    const progress = indicator.querySelector('progress');

    expect(progress?.getAttribute('aria-label')).toBe('Upload progress');
    expect(progress?.getAttribute('aria-hidden')).toBeNull();
    expect(progress?.getAttribute('value')).toBe('40');
    expect(progress?.getAttribute('max')).toBe('200');
    expect(indicator.classList.contains('ui-progress-indeterminate')).toBe(false);
    expect(indicator.style.getPropertyValue('--ui-progress-ratio')).toBe('0.2');
  });

  it('should omit value and expose the indeterminate state', () => {
    const [, indicator] = indicators();
    const progress = indicator.querySelector('progress');

    expect(progress?.getAttribute('aria-label')).toBe('Loading report');
    expect(progress?.getAttribute('value')).toBeNull();
    expect(progress?.getAttribute('max')).toBe('100');
    expect(indicator.classList.contains('ui-progress-indeterminate')).toBe(true);
  });

  it('should hide decorative progress and clamp values to max', () => {
    const [, , indicator] = indicators();
    const progress = indicator.querySelector('progress');
    const track = indicator.querySelector('.ui-progress-track');

    expect(progress?.getAttribute('aria-hidden')).toBe('true');
    expect(progress?.getAttribute('aria-label')).toBeNull();
    expect(progress?.getAttribute('value')).toBe('100');
    expect(track?.getAttribute('aria-hidden')).toBe('true');
  });
});
