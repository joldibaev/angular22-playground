import { afterNextRender, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: '[uiTableViewport]',
  exportAs: 'uiTableViewport',
  host: {
    class: 'ui-table-viewport',
    '(scroll)': 'scheduleRefresh()',
  },
})
export class UiTableViewport {
  // Layout owns the available height; the viewport only fills that flex space and reports metrics.
  readonly scrollTop = signal(0);
  readonly viewportHeight = signal(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private animationFrame: number | undefined;

  constructor() {
    afterNextRender(() => {
      this.refresh();

      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const observer = new ResizeObserver(() => this.scheduleRefresh());
      observer.observe(this.elementRef.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });

    this.destroyRef.onDestroy(() => {
      const view = this.elementRef.nativeElement.ownerDocument.defaultView;

      if (this.animationFrame !== undefined) {
        view?.cancelAnimationFrame(this.animationFrame);
      }
    });
  }

  // Scroll events can fire faster than the browser paints. One metric update per frame keeps the
  // virtual range responsive without scheduling redundant Angular work for the same visual frame.
  scheduleRefresh(): void {
    if (this.animationFrame !== undefined) {
      return;
    }

    const view = this.elementRef.nativeElement.ownerDocument.defaultView;

    if (!view?.requestAnimationFrame) {
      this.refresh();
      return;
    }

    this.animationFrame = view.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.refresh();
    });
  }

  refresh(): void {
    const element = this.elementRef.nativeElement;
    this.scrollTop.set(element.scrollTop);
    this.viewportHeight.set(element.clientHeight);
  }

  scrollTo(options: ScrollToOptions): void {
    const element = this.elementRef.nativeElement;

    // jsdom does not implement scrollTo; assigning scrollTop keeps component tests deterministic
    // while the supported Chrome path uses the native scrolling API and its behavior option.
    if (typeof element.scrollTo === 'function') {
      element.scrollTo(options);
    } else if (options.top !== undefined) {
      element.scrollTop = options.top;
    }

    this.refresh();
  }
}
