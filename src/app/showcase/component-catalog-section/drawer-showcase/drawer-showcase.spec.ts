import { TestBed } from '@angular/core/testing';
import { DrawerShowcase } from './drawer-showcase';

describe('DrawerShowcase', () => {
  it('documents every useful drawer feature with focused examples', async () => {
    const fixture = TestBed.createComponent(DrawerShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sides');
    expect(text).toContain('Dismiss behavior');
    expect(text).toContain('Controlled and programmatic');
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(7);
    expect(fixture.nativeElement.querySelectorAll('ui-drawer')).toHaveLength(13);
  });

  it('resets the interactive footer example', async () => {
    const fixture = TestBed.createComponent(DrawerShowcase);
    await fixture.whenStable();

    const reset = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (button) => (button as HTMLButtonElement).textContent?.trim() === 'Reset',
    ) as HTMLButtonElement;
    reset.click();
    await fixture.whenStable();

    expect(
      (fixture.nativeElement.querySelector('ui-switch input') as HTMLInputElement).checked,
    ).toBe(false);
  });
});
