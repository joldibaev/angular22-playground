import { TestBed } from '@angular/core/testing';
import { AlertShowcase } from './alert-showcase';

describe('AlertShowcase', () => {
  it('documents variants, actions, and opt-in live semantics', async () => {
    const fixture = TestBed.createComponent(AlertShowcase);
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Destructive');
    expect(text).toContain('Action');
    expect(text).toContain('Dynamic urgent alert');
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(4);
    expect(fixture.nativeElement.querySelector('ui-alert[role="alert"]')).toBeNull();
  });

  it('renders the dynamic alert after the trigger is activated', async () => {
    const fixture = TestBed.createComponent(AlertShowcase);
    await fixture.whenStable();
    const button = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (item) => (item as HTMLButtonElement).textContent?.trim() === 'Simulate connection loss',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('ui-alert[role="alert"]')).toBeTruthy();
  });
});
