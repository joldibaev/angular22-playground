import { TestBed } from '@angular/core/testing';
import { BarcodeShowcase } from './barcode-showcase';

describe('BarcodeShowcase', () => {
  it('documents formats, dimensions, text, accessibility, and validation', async () => {
    const fixture = TestBed.createComponent(BarcodeShowcase);
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Formats');
    expect(text).toContain('Human-readable text');
    expect(text).toContain('Invalid data');
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(6);
    expect(fixture.nativeElement.querySelector('[data-state="invalid"]')).toBeTruthy();
  });
});
