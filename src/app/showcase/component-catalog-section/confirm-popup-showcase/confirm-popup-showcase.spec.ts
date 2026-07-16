import { TestBed } from '@angular/core/testing';
import { ConfirmPopupShowcase } from './confirm-popup-showcase';

describe('ConfirmPopupShowcase', () => {
  it('documents default, destructive, placement, and controlled usage', async () => {
    const fixture = TestBed.createComponent(ConfirmPopupShowcase);
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Destructive');
    expect(text).toContain('Placement and collision fallback');
    expect(text).toContain('Controlled and programmatic');
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(4);
    expect(fixture.nativeElement.querySelectorAll('[uiConfirmPopup]')).toHaveLength(4);

    fixture.destroy();
  });
});
