import { TestBed } from '@angular/core/testing';
import { DialogConfirmShowcase } from './dialog-confirm-showcase';

describe('DialogConfirmShowcase', () => {
  it('documents both tones, custom copy, and dismissal outcomes', async () => {
    const fixture = TestBed.createComponent(DialogConfirmShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Destructive');
    expect(text).toContain('Custom copy');
    expect(text).toContain('Outcomes and dismissal');
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(fixture.nativeElement.querySelectorAll('ui-dialog-confirm')).toHaveLength(4);
  });

  it('reports a confirmation outcome', async () => {
    const fixture = TestBed.createComponent(DialogConfirmShowcase);
    await fixture.whenStable();

    const confirm = fixture.nativeElement.querySelector(
      'ui-dialog-confirm .ui-button-destructive',
    ) as HTMLButtonElement;
    confirm.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Last action: Deleted');
  });
});
