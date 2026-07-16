import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { syncPopover } from '../../shared/sync-popover';
import { UiMenuGroup } from '../ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../ui-menu/ui-menu-item/ui-menu-item';

type UiContextMenuSection = {
  readonly group?: UiMenuGroup;
  readonly items: readonly UiMenuItem[];
};

type UiContextMenuDeclaration = { readonly group: UiMenuGroup } | { readonly item: UiMenuItem };

export interface UiContextMenuSelection<T> {
  readonly value: string;
  readonly context: T;
}

const DOCUMENT_POSITION_FOLLOWING = 4;
const VIEWPORT_MARGIN = 8;
const POINTER_GAP = 4;

@Component({
  selector: 'ui-context-menu',
  imports: [Menu, MenuContent, MenuItem, MenuTrigger, NgTemplateOutlet],
  templateUrl: './ui-context-menu.html',
  styleUrls: ['../../shared/ui-popup.css', '../ui-menu/ui-menu.css', './ui-context-menu.css'],
})
export class UiContextMenu<T = unknown> {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly trigger = viewChild.required<MenuTrigger<string>>('contextTrigger');
  readonly items = contentChildren(UiMenuItem, { descendants: true });
  readonly groups = contentChildren(UiMenuGroup);
  readonly context = signal<T | undefined>(undefined);
  readonly itemSelected = output<UiContextMenuSelection<T>>();

  protected readonly position = signal({ x: 0, y: 0 });
  private readonly destroyRef = inject(DestroyRef);
  private returnFocusTo: HTMLElement | undefined;
  private restoreFocusOnClose = true;
  private scrollDocument: Document | undefined;
  protected readonly sections = computed<UiContextMenuSection[]>(() => {
    const groups = this.groups();
    const groupedItems = new Set(groups.flatMap((group) => group.items()));
    const declarations: UiContextMenuDeclaration[] = [
      ...groups.filter((group) => group.items().length > 0).map((group) => ({ group }) as const),
      ...this.items()
        .filter((item) => !groupedItems.has(item))
        .map((item) => ({ item }) as const),
    ].sort(compareDeclarations);
    const sections: UiContextMenuSection[] = [];

    for (const declaration of declarations) {
      if ('group' in declaration) {
        sections.push({ group: declaration.group, items: declaration.group.items() });
        continue;
      }

      const previous = sections.at(-1);

      if (previous && !previous.group) {
        sections[sections.length - 1] = { items: [...previous.items, declaration.item] };
      } else {
        sections.push({ items: [declaration.item] });
      }
    }

    return sections;
  });

  constructor() {
    afterRenderEffect(() => {
      const menu = this.menu();
      const visible = menu?.visible() ?? false;
      const position = this.position();

      syncPopover(menu?.element, visible);

      if (menu && visible) {
        positionContextMenu(menu.element, position.x, position.y);
        this.startScrollDismiss(menu.element.ownerDocument);
      } else {
        this.stopScrollDismiss();
      }
    });

    this.destroyRef.onDestroy(() => this.stopScrollDismiss());
  }

  openAt(x: number, y: number, context: T, returnFocusTo?: HTMLElement): void {
    this.position.set({ x, y });
    this.context.set(context);
    this.returnFocusTo = returnFocusTo;
    this.restoreFocusOnClose = true;
    this.trigger().open();
  }

  close(): void {
    this.trigger().close();
  }

  protected onItemSelected(value: string): void {
    const context = this.context();

    if (context !== undefined) {
      this.itemSelected.emit({ value, context });
    }

    queueMicrotask(() => this.trigger().close());
  }

  protected onPopoverToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.stopScrollDismiss();
      this.trigger().close();

      if (this.restoreFocusOnClose && this.returnFocusTo?.isConnected) {
        this.returnFocusTo.focus({ preventScroll: true });
      }

      this.returnFocusTo = undefined;
      this.restoreFocusOnClose = true;
    }
  }

  private readonly onDocumentScroll = (event: Event): void => {
    const menuElement = this.menu()?.element;

    if (!menuElement || event.composedPath().includes(menuElement)) {
      return;
    }

    // Pointer coordinates are not a durable anchor, and a virtual row may disappear during
    // scrolling. Dismiss instead of leaving actions attached to an invisible record; do not move
    // focus back to the row because that would fight the user's scroll position.
    this.restoreFocusOnClose = false;
    this.stopScrollDismiss();
    this.trigger().close();
  };

  private startScrollDismiss(document: Document): void {
    if (this.scrollDocument === document) {
      return;
    }

    this.stopScrollDismiss();
    this.scrollDocument = document;
    // Element scroll events do not bubble, so capture is required for nested table scrollports.
    document.addEventListener('scroll', this.onDocumentScroll, { capture: true, passive: true });
  }

  private stopScrollDismiss(): void {
    this.scrollDocument?.removeEventListener('scroll', this.onDocumentScroll, true);
    this.scrollDocument = undefined;
  }
}

/**
 * A pointer is a viewport coordinate, not a durable DOM anchor. Positioning the
 * top-layer popover directly also avoids containing-block offsets when the menu
 * is declared inside scrollports such as ui-table-viewport.
 */
function positionContextMenu(element: HTMLElement, x: number, y: number): void {
  element.style.left = `${x}px`;
  element.style.top = `${y + POINTER_GAP}px`;

  // Layout dimensions stay stable while the inner box performs its scale transition.
  const menuWidth = element.offsetWidth;
  const menuHeight = element.offsetHeight;
  const viewport = element.ownerDocument.defaultView;

  if (!viewport) {
    return;
  }

  const opensBefore = x + menuWidth + VIEWPORT_MARGIN > viewport.innerWidth;
  const opensAbove = y + POINTER_GAP + menuHeight + VIEWPORT_MARGIN > viewport.innerHeight;
  const preferredLeft = opensBefore ? x - menuWidth : x;
  const preferredTop = opensAbove ? y - menuHeight - POINTER_GAP : y + POINTER_GAP;
  const maxLeft = Math.max(VIEWPORT_MARGIN, viewport.innerWidth - menuWidth - VIEWPORT_MARGIN);
  const maxTop = Math.max(VIEWPORT_MARGIN, viewport.innerHeight - menuHeight - VIEWPORT_MARGIN);

  element.style.left = `${clamp(preferredLeft, VIEWPORT_MARGIN, maxLeft)}px`;
  element.style.top = `${clamp(preferredTop, VIEWPORT_MARGIN, maxTop)}px`;
  element.dataset['inlinePlacement'] = opensBefore ? 'before' : 'after';
  element.dataset['blockPlacement'] = opensAbove ? 'before' : 'after';
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function compareDeclarations(
  first: UiContextMenuDeclaration,
  second: UiContextMenuDeclaration,
): number {
  const firstElement = ('group' in first ? first.group : first.item).element.nativeElement;
  const secondElement = ('group' in second ? second.group : second.item).element.nativeElement;
  const position = firstElement.compareDocumentPosition(secondElement);

  return position & DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
