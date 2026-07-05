import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { TableShowcase } from './table-showcase';
describe('TableShowcase', () => {
  it('documents presentation, sorting, contextual actions, and virtualization', async () => {
    const f = TestBed.createComponent(TableShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(f.debugElement.queryAll(By.directive(UiContextMenuTrigger))).toHaveLength(5);
    expect(f.nativeElement.textContent).toContain('Row context menu');
    expect(f.nativeElement.textContent).toContain('Virtual and incremental loading');
  });
});
