/**
 * Reconciles a native popover's open state with a boolean source of truth by
 * calling `showPopover()`/`hidePopover()` only when the state actually differs.
 * Shared by every component that owns popover visibility imperatively
 * (combobox/menu surfaces, input validation messages, and the popover directive).
 */
export function syncPopover(
  element: HTMLElement | undefined,
  open: boolean | (() => boolean),
  pendingRetries = 2,
) {
  if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
    return;
  }

  const shouldOpen = typeof open === 'function' ? open() : open;

  if (!element.isConnected) {
    // Native popovers throw if opened while detached; retry briefly for elements
    // created during the same render pass and connected on a following frame.
    if (shouldOpen && pendingRetries > 0) {
      requestAnimationFrame(() => syncPopover(element, open, pendingRetries - 1));
    }

    return;
  }

  try {
    if (shouldOpen && !element.matches(':popover-open')) {
      element.showPopover();
    } else if (!shouldOpen && element.matches(':popover-open')) {
      element.hidePopover();
    }
  } catch (error) {
    // During the first render the document may not be fully active yet, which
    // makes showPopover() temporarily throw InvalidStateError. Reconcile again
    // after a paint instead of waiting for unrelated input to change state.
    if (shouldOpen && error instanceof DOMException && error.name === 'InvalidStateError') {
      if (pendingRetries > 0) {
        requestAnimationFrame(() => syncPopover(element, open, pendingRetries - 1));
      }

      return;
    }

    throw error;
  }
}
