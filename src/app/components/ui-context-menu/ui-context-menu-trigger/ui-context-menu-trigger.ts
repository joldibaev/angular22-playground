import { Directive, input } from '@angular/core';
import { UiContextMenu } from '../ui-context-menu';

@Directive({
  selector: '[uiContextMenuTrigger]',
  host: {
    // Angular may consume a bound directive input without leaving that attribute in the DOM.
    // Keep this marker as the stable styling hook for table rows and other trigger consumers.
    class: 'ui-context-menu-trigger',
    '(contextmenu)': 'onContextMenu($event)',
    '(pointerup)': 'onPointerUp()',
    '(pointercancel)': 'onPointerCancel()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiContextMenuTrigger<T = unknown> {
  readonly menu = input.required<UiContextMenu<T>>({ alias: 'uiContextMenuTrigger' });
  readonly context = input.required<T>({ alias: 'uiContextMenuContext' });

  private pendingPointerOpen: (() => void) | undefined;

  protected onContextMenu(event: PointerEvent): void {
    event.preventDefault();
    const origin = event.currentTarget as HTMLElement;
    const x = event.clientX;
    const y = event.clientY;
    const context = this.context();
    const open = () => {
      if (origin.isConnected) {
        this.menu().openAt(x, y, context, origin);
      }
    };

    if (event.buttons === 0) {
      open();
      return;
    }

    // macOS dispatches `contextmenu` before pointerup. Capturing that pointer
    // keeps the release on this host so opening can wait out native light dismiss.
    origin.setPointerCapture(event.pointerId);
    this.menu().close();
    this.pendingPointerOpen = open;
  }

  protected onPointerUp(): void {
    const open = this.pendingPointerOpen;
    this.pendingPointerOpen = undefined;

    if (open) {
      queueMicrotask(open);
    }
  }

  protected onPointerCancel(): void {
    this.pendingPointerOpen = undefined;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) {
      return;
    }

    event.preventDefault();
    const host = event.currentTarget as HTMLElement;
    const origin = event.target instanceof HTMLElement ? event.target : host;
    const bounds = origin.getBoundingClientRect();
    this.menu().openAt(bounds.left, bounds.bottom, this.context(), origin);
  }
}
