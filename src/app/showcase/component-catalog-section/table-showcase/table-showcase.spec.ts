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

  it('opens the row context menu from a table row', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const row = host.querySelector(
      'app-showcase-example[aria-label="Table row context menu example"] tbody tr',
    ) as HTMLTableRowElement;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 80,
    });

    row.dispatchEvent(event);
    await fixture.whenStable();

    const menu = host.querySelector('[role="menu"]') as HTMLElement;
    expect(event.defaultPrevented).toBe(true);
    expect(menu.getAttribute('data-visible')).toBe('true');
    expect(menu.style.left).toBe('120px');
    expect(menu.style.top).toBe('84px');
  });

  it.each([
    ['ContextMenu', false],
    ['F10', true],
  ])('opens from %s at the focused row action and restores its focus', async (key, shiftKey) => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const example = host.querySelector(
      'app-showcase-example[aria-label="Table row context menu example"]',
    ) as HTMLElement;
    const row = example.querySelector('tbody tr') as HTMLTableRowElement;
    const action = row.querySelector('button') as HTMLButtonElement;
    const focus = vi.spyOn(action, 'focus');
    action.getBoundingClientRect = () => ({ left: 32, bottom: 64 }) as DOMRect;

    action.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, shiftKey }),
    );
    await fixture.whenStable();

    const menu = example.querySelector('[role="menu"]') as HTMLElement;
    expect(row.hasAttribute('tabindex')).toBe(false);
    expect(menu.getAttribute('data-visible')).toBe('true');
    expect(menu.style.left).toBe('32px');
    expect(menu.style.top).toBe('68px');

    menu.dispatchEvent(createToggleEvent('closed'));
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('selects an action with the context of the row that opened the menu', async () => {
    const fixture = TestBed.createComponent(TableShowcase);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const example = host.querySelector(
      'app-showcase-example[aria-label="Table row context menu example"]',
    ) as HTMLElement;
    const rows = example.querySelectorAll<HTMLTableRowElement>('tbody tr');

    rows[1].dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 120, clientY: 80 }),
    );
    await fixture.whenStable();

    const duplicate = Array.from(example.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
      (item) => item.textContent?.includes('Duplicate row'),
    );
    expect(duplicate).toBeDefined();

    duplicate?.click();
    await fixture.whenStable();

    expect(example.querySelector('output')?.textContent).toContain('duplicate: Matcha 2');
  });
});

function createToggleEvent(newState: 'open' | 'closed'): ToggleEvent {
  const event = new Event('toggle') as ToggleEvent;
  Object.defineProperty(event, 'newState', { value: newState });
  return event;
}
