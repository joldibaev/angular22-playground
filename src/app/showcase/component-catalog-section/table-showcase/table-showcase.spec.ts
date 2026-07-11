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
    expect(f.nativeElement.textContent).toContain('Striped rows, hover, and sticky header');
    expect(f.nativeElement.textContent).toContain('Row context menu');
    expect(f.nativeElement.textContent).toContain('Virtual and incremental loading');
    expect(f.nativeElement.textContent).not.toContain('Density');
  });

  it('keeps the other examples stable when the backend-sorted page changes', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const presentation = host.querySelector(
      'section[aria-labelledby="table-presentation-title"] tbody',
    ) as HTMLElement;
    const contextMenu = host.querySelector(
      'section[aria-labelledby="table-context-menu-title"] tbody',
    ) as HTMLElement;
    const sortable = host.querySelector(
      'section[aria-labelledby="table-sort-title"] tbody',
    ) as HTMLElement;
    const stockSort = host.querySelector(
      'section[aria-labelledby="table-sort-title"] th[uiTableSort="stock"] button',
    ) as HTMLButtonElement;
    const presentationBefore = presentation.textContent;
    const contextMenuBefore = contextMenu.textContent;
    const sortableBefore = sortable.textContent;

    stockSort.click();
    await fixture.whenStable();

    expect(sortable.textContent).not.toBe(sortableBefore);
    expect(presentation.textContent).toBe(presentationBefore);
    expect(contextMenu.textContent).toBe(contextMenuBefore);
  });
});
