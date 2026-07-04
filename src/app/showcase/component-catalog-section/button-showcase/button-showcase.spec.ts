import { TestBed } from '@angular/core/testing';
import { ButtonShowcase } from './button-showcase';
describe('ButtonShowcase', () => {
  it('documents the complete useful API', async () => {
    const f = TestBed.createComponent(ButtonShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(6);
    expect(f.nativeElement.querySelector('button[loading]')).toBeTruthy();
  });
});
