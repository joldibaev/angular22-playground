/**
 * Reconciles a native popover's open state with a boolean source of truth by
 * calling `showPopover()`/`hidePopover()` only when the state actually differs.
 * Shared by every component that owns popover visibility imperatively
 * (combobox/menu surfaces and the popover directive).
 */
export function syncPopover(element: HTMLElement | undefined, open: boolean) {
  if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
    return;
  }

  if (open && !element.matches(':popover-open')) {
    element.showPopover();
  } else if (!open && element.matches(':popover-open')) {
    element.hidePopover();
  }
}
