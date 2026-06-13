export function syncPopup(element: HTMLElement | undefined, expanded: boolean) {
  if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
    return;
  }

  if (expanded && !element.matches(':popover-open')) {
    element.showPopover();
  } else if (!expanded && element.matches(':popover-open')) {
    element.hidePopover();
  }
}
