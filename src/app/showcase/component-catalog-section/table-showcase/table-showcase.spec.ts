import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { TableShowcase } from './table-showcase';
describe('TableShowcase', () => {
  it('documents presentation, sorting, contextual actions, and virtualization', async () => {
    const f = TestBed.createComponent(TableShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(5);
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
      'app-showcase-example[aria-label="Table presentation options"] tbody',
    ) as HTMLElement;
    const contextMenu = host.querySelector(
      'app-showcase-example[aria-label="Table row context menu example"] tbody',
    ) as HTMLElement;
    const sortable = host.querySelector(
      'app-showcase-example[aria-label="Table sorting example"] tbody',
    ) as HTMLElement;
    const stockSort = host.querySelector(
      'app-showcase-example[aria-label="Table sorting example"] th[uiTableSort="stock"] button',
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
