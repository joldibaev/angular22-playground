import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { uiSonnerState } from './ui-sonner.state';
import {
  UiSonnerPosition,
  UiSonnerTheme,
  UiSonnerToast as UiSonnerToastModel,
  UiSonnerToastOptions,
} from './ui-sonner.type';
import { UiSonnerToast } from './ui-sonner-toast/ui-sonner-toast';

const DEFAULT_DURATION = 4000;
const DEFAULT_VISIBLE_TOASTS = 3;
const DEFAULT_GAP = 14;
const DEFAULT_OFFSET = '32px';
const DEFAULT_WIDTH = 356;

@Component({
  selector: 'ui-sonner',
  imports: [UiSonnerToast],
  templateUrl: './ui-sonner.html',
  styleUrl: './ui-sonner.css',
  exportAs: 'uiSonner',
})
export class UiSonner implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly toasts = uiSonnerState.toasts;
  protected readonly heights = uiSonnerState.heights;
  protected readonly expanded = linkedSignal({
    source: this.toasts,
    computation: (toasts) => toasts.length < 1,
  });
  protected readonly interacting = signal(false);
  protected readonly lastFocusedElement = signal<HTMLElement | null>(null);
  protected readonly isFocusWithin = signal(false);
  protected readonly listRef = viewChild<ElementRef<HTMLOListElement>>('listRef');

  readonly invert = input(false, { transform: booleanAttribute });
  readonly theme = input<UiSonnerTheme>('system');
  readonly position = input<UiSonnerPosition>('bottom-right');
  readonly hotKey = input<string[]>(['altKey', 'KeyT']);
  readonly expand = input(false, { transform: booleanAttribute });
  readonly duration = input(DEFAULT_DURATION, { transform: numberAttribute });
  readonly visibleToasts = input(DEFAULT_VISIBLE_TOASTS, { transform: numberAttribute });
  readonly closeButton = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Close notification');
  readonly toastOptions = input<UiSonnerToastOptions>({});
  readonly offset = input<string | number | null>(null);
  readonly gap = input(DEFAULT_GAP, { transform: numberAttribute });
  readonly label = input('Notifications');
  readonly className = input('', { alias: 'class' });
  readonly styleMap = input<Record<string, string>>({}, { alias: 'style' });

  protected readonly positions = computed(() => {
    const positions = [this.position(), ...this.toasts().map((toast) => toast.position)];
    return Array.from(new Set(positions.filter((value): value is UiSonnerPosition => !!value)));
  });
  protected readonly hotKeyLabel = computed(() =>
    this.hotKey().join('+').replaceAll('Key', '').replaceAll('Digit', ''),
  );
  protected readonly themeAttribute = computed(() =>
    this.theme() === 'system' ? null : this.theme(),
  );
  protected readonly listClass = computed(() =>
    ['ui-sonner-list', this.className()].filter(Boolean).join(' '),
  );
  protected readonly frontToastHeightAttribute = computed(
    () => `${this.heights()[0]?.height ?? 0}px`,
  );
  protected readonly offsetAttribute = computed(() =>
    typeof this.offset() === 'number' ? `${this.offset()}px` : (this.offset() ?? DEFAULT_OFFSET),
  );
  protected readonly widthAttribute = computed(() => `${DEFAULT_WIDTH}px`);
  protected readonly toasterStyles = computed(() => ({
    ...this.styleMap(),
  }));
  protected readonly groups = computed(() =>
    this.positions().map((position) => ({
      position,
      y: position.startsWith('top') ? 'top' : 'bottom',
      x: position.endsWith('left') ? 'left' : position.endsWith('center') ? 'center' : 'right',
      toasts: this.toastsFor(position),
    })),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  protected handleBlur(event: FocusEvent): void {
    const target = event.target;

    if (
      target instanceof HTMLOListElement &&
      this.isFocusWithin() &&
      !(event.relatedTarget instanceof HTMLElement && target.contains(event.relatedTarget))
    ) {
      this.isFocusWithin.set(false);
      this.lastFocusedElement()?.focus({ preventScroll: true });
      this.lastFocusedElement.set(null);
    }
  }

  protected handleFocus(event: FocusEvent): void {
    if (event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false') {
      return;
    }

    if (!this.isFocusWithin()) {
      this.isFocusWithin.set(true);
      this.lastFocusedElement.set(
        event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null,
      );
    }
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false') {
      return;
    }

    this.interacting.set(true);
  }

  protected handleMouseLeave(): void {
    if (!this.interacting()) {
      this.expanded.set(false);
    }
  }

  private toastsFor(position: UiSonnerPosition): UiSonnerToastModel[] {
    return this.toasts().filter((toast) => (toast.position ?? this.position()) === position);
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    const listRef = this.listRef()?.nativeElement;

    if (!listRef) {
      return;
    }

    if (
      this.hotKey().every(
        (key) => Boolean((event as unknown as Record<string, unknown>)[key]) || event.code === key,
      )
    ) {
      this.expanded.set(true);
      listRef.focus();
    }

    if (
      event.code === 'Escape' &&
      (document.activeElement === listRef || listRef.contains(document.activeElement))
    ) {
      this.expanded.set(false);
    }
  };
}
