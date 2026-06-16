/**
 * Reconciles a native popover's open state with a boolean source of truth by
 * calling `showPopover()`/`hidePopover()` only when the state actually differs.
 * Shared by every component that owns popover visibility imperatively
 * (combobox/menu surfaces, input validation messages, and the popover directive).
 */
export function syncPopover(
  element: HTMLElement | undefined,
  open: boolean | (() => boolean),
  disconnectedRetries = 1,
) {
  if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
    return;
  }

  const shouldOpen = typeof open === 'function' ? open() : open;

  if (!element.isConnected) {
    // Native popovers throw if opened while detached; retry once for elements
    // that are created during the same render pass and connect on the next frame.
    if (shouldOpen && disconnectedRetries > 0) {
      requestAnimationFrame(() => syncPopover(element, open, disconnectedRetries - 1));
    }

    return;
  }

  if (shouldOpen && !element.matches(':popover-open')) {
    element.showPopover();
  } else if (!shouldOpen && element.matches(':popover-open')) {
    element.hidePopover();
  }
}
