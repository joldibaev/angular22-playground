import { TestBed } from '@angular/core/testing';
import { TreeShowcase } from './tree-showcase';
describe('TreeShowcase', () => {
  it('documents selection, expansion, guides, and navigation', async () => {
    const f = TestBed.createComponent(TreeShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(f.nativeElement.textContent).toContain('Multiple selection');
  });
});
