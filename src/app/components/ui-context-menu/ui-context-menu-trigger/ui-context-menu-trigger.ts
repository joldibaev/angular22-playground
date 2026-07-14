import { Directive, input } from '@angular/core';
import { UiContextMenu } from '../ui-context-menu';

@Directive({
  selector: '[uiContextMenuTrigger]',
  host: {
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiContextMenuTrigger<T = unknown> {
  readonly menu = input.required<UiContextMenu<T>>({ alias: 'uiContextMenuTrigger' });
  readonly context = input.required<T>({ alias: 'uiContextMenuContext' });

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.menu().openAt(
      event.clientX,
      event.clientY,
      this.context(),
      event.currentTarget as HTMLElement,
    );
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
