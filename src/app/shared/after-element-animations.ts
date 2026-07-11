/**
 * Runs completion logic after the animations currently affecting an element settle.
 * With zero-duration/overridden CSS (and in jsdom) there are no animations, so
 * completion happens in a microtask instead of waiting forever for transitionend.
 */
export function afterElementAnimations(element: Element, complete: () => void): void {
  queueMicrotask(() => {
    const animations =
      typeof element.getAnimations === 'function' ? element.getAnimations({ subtree: false }) : [];

    if (!animations.length) {
      complete();
      return;
    }

    void Promise.allSettled(animations.map((animation) => animation.finished)).then(complete);
  });
}
