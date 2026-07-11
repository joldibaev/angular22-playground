import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

@Directive({
  selector: '[uiTableViewport]',
  exportAs: 'uiTableViewport',
  host: {
    class: 'ui-table-viewport',
    '(scroll)': 'refresh()',
  },
})
export class UiTableViewport {
  // Layout owns the available height; the viewport only fills that flex space and reports metrics.
  readonly scrollTop = signal(0);
  readonly viewportHeight = signal(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.refresh();

      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const observer = new ResizeObserver(() => this.refresh());
      observer.observe(this.elementRef.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  refresh(): void {
    const element = this.elementRef.nativeElement;
    this.scrollTop.set(element.scrollTop);
    this.viewportHeight.set(element.clientHeight);
  }

  scrollTo(options: ScrollToOptions): void {
    this.elementRef.nativeElement.scrollTo(options);
    this.refresh();
  }
}
