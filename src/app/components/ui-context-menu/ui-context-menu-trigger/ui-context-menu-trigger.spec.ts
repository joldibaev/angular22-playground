import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiContextMenu } from '../ui-context-menu';
import { UiContextMenuTrigger } from './ui-context-menu-trigger';

@Component({
  imports: [UiContextMenuTrigger],
  template: `
    <div
      class="target"
      tabindex="0"
      [uiContextMenuTrigger]="menu"
      [uiContextMenuContext]="context"
    ></div>
  `,
})
class TestHost {
  readonly context = { id: 7 };
  readonly menu = { openAt: vi.fn() } as unknown as UiContextMenu<{ id: number }>;
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
});
