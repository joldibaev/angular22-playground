import { TestBed } from '@angular/core/testing';
import { ProgressShowcase } from './progress-showcase';
describe('ProgressShowcase', () => {
  it('documents all progress modes', async () => {
    const f = TestBed.createComponent(ProgressShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(3);
    f.destroy();
  });

  it('lets the determinate example increase and decrease its value', async () => {
    const f = TestBed.createComponent(ProgressShowcase);
    await f.whenStable();

    const values = Array.from(
      f.nativeElement.querySelectorAll('.ui-progress-value'),
    ) as HTMLElement[];
    const increase = f.nativeElement.querySelector('[data-progress-increase]') as HTMLButtonElement;
    const decrease = f.nativeElement.querySelector('[data-progress-decrease]') as HTMLButtonElement;

    expect(values[0]?.textContent?.replace(/\s/g, '')).toBe('40%');
    expect(values[1]?.textContent?.replace(/\s/g, '')).toBe('40%');

    increase.click();
    await f.whenStable();
    expect(values[0]?.textContent?.replace(/\s/g, '')).toBe('60%');
    expect(values[1]?.textContent?.replace(/\s/g, '')).toBe('60%');
    expect(values[0]?.classList).toContain('ui-progress-value-animating');
    expect(values[1]?.classList).not.toContain('ui-progress-value-animating');

    decrease.click();
    await f.whenStable();
    expect(values[0]?.textContent?.replace(/\s/g, '')).toBe('40%');
    expect(values[1]?.textContent?.replace(/\s/g, '')).toBe('40%');

    f.destroy();
  });
});
