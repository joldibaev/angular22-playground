import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMenuGroup } from '../ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../ui-menu/ui-menu-item/ui-menu-item';
import { UiContextMenu, UiContextMenuSelection } from './ui-context-menu';
import { UiContextMenuTrigger } from './ui-context-menu-trigger/ui-context-menu-trigger';

interface TestRow {
  readonly id: number;
  readonly label: string;
}

@Component({
  imports: [UiContextMenu, UiContextMenuTrigger, UiMenuGroup, UiMenuItem],
  template: `
    <div
      class="target"
      tabindex="0"
      [uiContextMenuTrigger]="contextMenu"
      [uiContextMenuContext]="row"
    >
      Target row
    </div>

    <ui-context-menu #contextMenu (itemSelected)="selected.set($event)">
      <ui-menu-item value="open">Open</ui-menu-item>
      <ui-menu-group label="Danger zone">
        <ui-menu-item value="delete" variant="destructive">Delete</ui-menu-item>
      </ui-menu-group>
    </ui-context-menu>
  `,
})
class TestHost {
  readonly menu = viewChild.required(UiContextMenu<TestRow>);
  readonly row: TestRow = { id: 7, label: 'Arabica' };
  readonly selected = signal<UiContextMenuSelection<unknown> | undefined>(undefined);
}

async function createHost(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);
  await fixture.whenStable();
  await fixture.whenRenderingDone();
  return fixture;
}

describe('UiContextMenu', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('connects the hidden Angular Aria trigger to a viewport-positioned menu', async () => {
    const fixture = await createHost();
    const contextMenu = fixture.nativeElement.querySelector('ui-context-menu') as HTMLElement;
    const origin = fixture.nativeElement.querySelector('.ui-context-menu-origin') as HTMLElement;
    const menu = document.querySelector('[role="menu"]') as HTMLElement;

    expect(getComputedStyle(contextMenu).position).toBe('static');
    expect(origin.getAttribute('aria-hidden')).toBe('true');
    expect(origin.getAttribute('aria-haspopup')).toBe('true');
    expect(menu.getAttribute('popover')).toBe('auto');
    expect(menu.style.positionAnchor).toBe('');
  });

  it('uses the shared menu popup surface tokens', async () => {
    const fixture = await createHost();
    const contextMenu = fixture.nativeElement.querySelector('ui-context-menu') as HTMLElement;
    const style = getComputedStyle(contextMenu);

    expect(style.getPropertyValue('--ui-popup-background').trim()).toBe(
      'var(--ui-glass-background)',
    );
    expect(style.getPropertyValue('--ui-popup-offset').trim()).toBe('0.5rem');
    expect(style.getPropertyValue('--ui-popup-padding').trim()).toBe('0.25rem');
    expect(style.getPropertyValue('--ui-popup-option-radius').trim()).toBe('0.375rem');
  });

  it('opens at pointer coordinates and retains the supplied target context', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 240,
      clientY: 160,
    });

    target.dispatchEvent(event);
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const origin = fixture.nativeElement.querySelector('.ui-context-menu-origin') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;

    expect(event.defaultPrevented).toBe(true);
    expect(menu.style.left).toBe('240px');
    expect(menu.style.top).toBe('164px');
    expect(origin.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.menu().context()).toEqual(fixture.componentInstance.row);
    expect(
      Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).map((item) =>
        item.textContent?.trim(),
      ),
    ).toEqual(['Open', 'Delete']);
  });

  it.each([
    ['ContextMenu', false],
    ['F10', true],
  ])('opens from the %s keyboard command at the target edge', async (key, shiftKey) => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.getBoundingClientRect = () => ({ left: 18, bottom: 72 }) as DOMRect;

    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, shiftKey });
    target.dispatchEvent(event);
    await fixture.whenStable();

    const origin = fixture.nativeElement.querySelector('.ui-context-menu-origin') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    expect(event.defaultPrevented).toBe(true);
    expect(menu.style.left).toBe('18px');
    expect(menu.style.top).toBe('76px');
    expect(origin.getAttribute('aria-expanded')).toBe('true');
  });

  it('emits the action together with its target context', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 12, clientY: 24 }),
    );
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    (document.querySelector('[role="menuitem"]') as HTMLElement).click();
    await fixture.whenStable();

    expect(fixture.componentInstance.selected()).toEqual({
      value: 'open',
      context: fixture.componentInstance.row,
    });
  });

  it('returns focus to the invocation target when the popover closes', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    const focus = vi.spyOn(target, 'focus');

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 12, clientY: 24 }));
    await fixture.whenStable();
    menu.dispatchEvent(createToggleEvent('closed'));

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does not focus an invocation target that was removed while the menu was open', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    const focus = vi.spyOn(target, 'focus');

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 12, clientY: 24 }));
    await fixture.whenStable();
    target.remove();
    menu.dispatchEvent(createToggleEvent('closed'));

    expect(focus).not.toHaveBeenCalled();
  });

  it('closes on external scroll without returning focus to the invocation target', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    const contextMenu = fixture.componentInstance.menu();
    const close = vi.spyOn(contextMenu.trigger(), 'close');
    const focus = vi.spyOn(target, 'focus');

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 12, clientY: 24 }));
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    close.mockClear();

    target.dispatchEvent(new Event('scroll'));
    menu.dispatchEvent(createToggleEvent('closed'));

    expect(close).toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
  });

  it('keeps the menu open while its own content scrolls', async () => {
    const fixture = await createHost();
    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    const close = vi.spyOn(fixture.componentInstance.menu().trigger(), 'close');

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 12, clientY: 24 }));
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    close.mockClear();

    menu.dispatchEvent(new Event('scroll'));

    expect(close).not.toHaveBeenCalled();
  });
});

function createToggleEvent(newState: 'open' | 'closed'): ToggleEvent {
  const event = new Event('toggle') as ToggleEvent;
  Object.defineProperty(event, 'newState', { value: newState });
  return event;
}
