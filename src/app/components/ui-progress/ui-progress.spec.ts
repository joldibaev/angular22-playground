import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiProgress } from './ui-progress';

@Component({
  imports: [UiProgress],
  template: `
    <ui-progress label="Upload progress" value="40" max="200" withValue />
    <ui-progress label="Loading report" />
    <ui-progress label="Duplicated progress" value="120" decorative />
    <ui-progress label="Secondary progress" value="50" withValue />
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
    expect(indicator.classList.contains('ui-progress-with-value')).toBe(true);
    expect(
      Array.from(indicator.querySelectorAll<HTMLElement>('.ui-progress-digit-column')).map(
        (column) => column.style.getPropertyValue('--ui-progress-digit-offset'),
      ),
    ).toEqual(['-2', '0']);
    expect(indicator.querySelector('.ui-progress-suffix')?.textContent).toBe('%');
    expect(indicator.querySelector('.ui-progress-value')?.getAttribute('aria-hidden')).toBe('true');
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

  it('should keep explicitly non-decorative progress hidden when it has no label', async () => {
    const unlabelled = TestBed.createComponent(UiProgress);
    unlabelled.componentRef.setInput('decorative', false);
    await unlabelled.whenStable();

    const progress = unlabelled.nativeElement.querySelector('progress');
    expect(progress.getAttribute('aria-hidden')).toBe('true');
    expect(progress.getAttribute('aria-label')).toBeNull();
  });

  it('should render rolling digit columns by default', () => {
    expect(indicators()[0]?.querySelectorAll('.ui-progress-digit-column')).toHaveLength(2);
    expect(indicators()[3]?.querySelectorAll('.ui-progress-digit-column')).toHaveLength(2);
  });
});
