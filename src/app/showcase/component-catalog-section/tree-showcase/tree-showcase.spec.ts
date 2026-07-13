import { TestBed } from '@angular/core/testing';
import { TreeShowcase } from './tree-showcase';
describe('TreeShowcase', () => {
  it('documents the recursive data structure, selection, expansion, and navigation', async () => {
    const f = TestBed.createComponent(TreeShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(5);
    expect(f.nativeElement.textContent).toContain('UiTreeItem[]');

    const firstCodeTab = Array.from(
      f.nativeElement.querySelectorAll('.ui-tab-trigger'),
    ).find((trigger) => (trigger as HTMLElement).textContent?.trim() === 'Code') as HTMLButtonElement;
    firstCodeTab.click();
    await f.whenStable();

    expect(f.nativeElement.textContent).toContain("children: [");
    expect(f.nativeElement.textContent).toContain('Multiple selection');
    expect(f.nativeElement.textContent).toContain('Without guides');
  });
});
