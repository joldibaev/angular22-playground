import { TestBed } from '@angular/core/testing';
import { ButtonShowcase } from './button-showcase';
describe('ButtonShowcase', () => {
  it('documents the complete useful API', async () => {
    const f = TestBed.createComponent(ButtonShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(6);
    const asyncButton = Array.from(
      f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent.includes('Save changes'))!;
    expect(asyncButton).toBeTruthy();
    expect(asyncButton.textContent).toContain('Save changes');
  });
});
