import { TestBed } from '@angular/core/testing';
import { ProgressShowcase } from './progress-showcase';
describe('ProgressShowcase', () => {
  it('documents all progress modes', async () => {
    const f = TestBed.createComponent(ProgressShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(3);
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

    const digits = (value: HTMLElement) =>
      Array.from(value.querySelectorAll<HTMLElement>('.ui-progress-digit-column')).map((column) =>
        column.style.getPropertyValue('--ui-progress-digit-offset'),
      );

    expect(values).toHaveLength(1);
    expect(digits(values[0])).toEqual(['-4', '0']);

    increase.click();
    await f.whenStable();
    expect(digits(values[0])).toEqual(['-6', '0']);

    decrease.click();
    await f.whenStable();
    expect(digits(values[0])).toEqual(['-4', '0']);

    f.destroy();
  });
});
