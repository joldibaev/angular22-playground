import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiContextMenu } from '../ui-context-menu';
import { UiContextMenuTrigger } from './ui-context-menu-trigger';

@Component({
  imports: [UiContextMenuTrigger],
  template: `
    <div class="target" tabindex="0" [uiContextMenuTrigger]="menu" [uiContextMenuContext]="context">
      <button type="button" class="row-action">Row action</button>
    </div>
  `,
})
class TestHost {
  readonly context = { id: 7 };
  readonly menu = { openAt: vi.fn(), close: vi.fn() } as unknown as UiContextMenu<{ id: number }>;
}

describe('UiContextMenuTrigger', () => {
  let fixture: ComponentFixture<TestHost>;
  let target: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    target = fixture.nativeElement.querySelector('.target');
  });

  it('opens at pointer coordinates with the bound context and origin', () => {
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 24,
      clientY: 36,
    });

    target.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(target.classList.contains('ui-context-menu-trigger')).toBe(true);
    expect(fixture.componentInstance.menu.openAt).toHaveBeenCalledWith(
      24,
      36,
      fixture.componentInstance.context,
      target,
    );
  });

  it('waits for the active context pointer to finish before opening', async () => {
    target.setPointerCapture = vi.fn();
    const contextMenuEvent = createPointerEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 24,
      clientY: 36,
      button: 2,
      buttons: 2,
      pointerId: 4,
    });

    target.dispatchEvent(contextMenuEvent);

    expect(contextMenuEvent.defaultPrevented).toBe(true);
    expect(target.setPointerCapture).toHaveBeenCalledWith(4);
    expect(fixture.componentInstance.menu.close).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.menu.openAt).not.toHaveBeenCalled();

    target.dispatchEvent(
      createPointerEvent('pointerup', {
        bubbles: true,
        button: 2,
        pointerId: 4,
      }),
    );
    await Promise.resolve();

    expect(fixture.componentInstance.menu.openAt).toHaveBeenCalledWith(
      24,
      36,
      fixture.componentInstance.context,
      target,
    );
  });

  it.each([
    ['ContextMenu', false],
    ['F10', true],
  ])('opens from the %s keyboard command at the target edge', (key, shiftKey) => {
    target.getBoundingClientRect = () => ({ left: 12, bottom: 48 }) as DOMRect;
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key,
      shiftKey,
    });

    target.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.menu.openAt).toHaveBeenCalledWith(
      12,
      48,
      fixture.componentInstance.context,
      target,
    );
  });

  it('ignores unrelated keyboard input', () => {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' });

    target.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.menu.openAt).not.toHaveBeenCalled();
  });

  it('positions from and returns focus to the focused descendant of a table-like row', () => {
    const action = target.querySelector('.row-action') as HTMLButtonElement;
    target.getBoundingClientRect = () => ({ left: 12, bottom: 48 }) as DOMRect;
    action.getBoundingClientRect = () => ({ left: 30, bottom: 64 }) as DOMRect;

    action.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'F10',
        shiftKey: true,
      }),
    );

    expect(fixture.componentInstance.menu.openAt).toHaveBeenCalledWith(
      30,
      64,
      fixture.componentInstance.context,
      action,
    );
  });
});

function createPointerEvent(
  type: string,
  init: MouseEventInit & { readonly pointerId: number },
): PointerEvent {
  const event = new MouseEvent(type, init) as PointerEvent;
  Object.defineProperties(event, {
    pointerId: { value: init.pointerId },
    pointerType: { value: 'mouse' },
  });
  return event;
}
