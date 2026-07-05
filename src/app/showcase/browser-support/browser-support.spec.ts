import { TestBed } from '@angular/core/testing';
import { BrowserSupport } from './browser-support';

describe('BrowserSupport', () => {
  it('renders the aggregate Baseline status and browser versions', async () => {
    const fixture = TestBed.createComponent(BrowserSupport);
    fixture.componentRef.setInput('profile', 'button');
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.baseline')?.textContent?.replace(/\s+/g, ' ')).toContain(
      'Baseline 2026',
    );
    expect(host.textContent).toContain('Newly available');
    expect(host.querySelector('.support')?.getAttribute('data-status')).toBe('newly');
    expect(host.querySelector<HTMLImageElement>('.baseline-icon')?.getAttribute('src')).toBe(
      '/baseline-icons/newly.svg',
    );
    expect(host.querySelector('[aria-label="Chrome 147 and later"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="Safari 26 and later"]')).not.toBeNull();
  });

  it('marks a profile with unsupported engines as limited', async () => {
    const fixture = TestBed.createComponent(BrowserSupport);
    fixture.componentRef.setInput('profile', 'tooltip');
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Limited availability');
    expect(host.querySelector('.support')?.getAttribute('data-status')).toBe('limited');
    expect(host.querySelector('[aria-label="Safari: not supported"]')).not.toBeNull();
  });
});
