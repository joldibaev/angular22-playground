import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'div[uiTableViewport]',
  exportAs: 'uiTableViewport',
  templateUrl: './ui-table-viewport.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-table-viewport',
    '[style.--ui-table-viewport-height]': 'heightStyle()',
    '(scroll)': 'refresh()',
  },
})
export class UiTableViewport {
  readonly height = input<number | string | null>(null);
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

  heightStyle(): string | null {
    const height = this.height();

    if (height === null) {
      return null;
    }

    return typeof height === 'number' ? `${Math.max(0, height)}px` : height;
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
