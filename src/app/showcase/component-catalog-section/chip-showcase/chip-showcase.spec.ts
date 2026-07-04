import { TestBed } from '@angular/core/testing';
import { ChipShowcase } from './chip-showcase';

describe('ChipShowcase', () => {
  it('documents variants, disabled state, overflow, and removal', async () => {
    const fixture = TestBed.createComponent(ChipShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Variants');
    expect(text).toContain('Disabled and overflow');
    expect(text).toContain('Removal');
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
  });

  it('removes and restores interactive tags', async () => {
    const fixture = TestBed.createComponent(ChipShowcase);
    await fixture.whenStable();

    const removalExample = fixture.nativeElement.querySelector(
      '[aria-labelledby="chip-removal-title"]',
    ) as HTMLElement;
    (removalExample.querySelector('.ui-chip-remove') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(removalExample.textContent).toContain('Last removed: Design');
    expect(removalExample.querySelectorAll('ui-chip')).toHaveLength(3);

    const reset = Array.from(removalExample.querySelectorAll('button')).find(
      (button) => (button as HTMLButtonElement).textContent?.trim() === 'Reset',
    ) as HTMLButtonElement;
    reset.click();
    await fixture.whenStable();

    expect(removalExample.querySelectorAll('ui-chip')).toHaveLength(4);
  });
});
