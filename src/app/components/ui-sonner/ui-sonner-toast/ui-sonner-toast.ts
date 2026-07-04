import { NgComponentOutlet } from '@angular/common';
import {
  afterRenderEffect,
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  linkedSignal,
  OnDestroy,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { UiButton } from '../../ui-button/ui-button';
import { UiIcon } from '../../ui-icon/ui-icon';
import { UiLoading } from '../../ui-loading/ui-loading';
import { uiSonnerState } from '../ui-sonner.state';
import {
  UiSonnerPosition,
  UiSonnerRenderable,
  UiSonnerToast as UiSonnerToastModel,
  UiSonnerToastType,
} from '../ui-sonner.type';

const DEFAULT_DURATION = 4000;
const SWIPE_THRESHOLD = 20;
const TIME_BEFORE_UNMOUNT = 200;

@Component({
  selector: 'ui-sonner-toast',
  imports: [NgComponentOutlet, UiButton, UiIcon, UiLoading],
  templateUrl: './ui-sonner-toast.html',
  styleUrl: './ui-sonner-toast.css',
})
export class UiSonnerToast implements AfterViewInit, OnDestroy {
  protected readonly toasts = uiSonnerState.toasts;
  protected readonly heights = uiSonnerState.heights;

  readonly toast = input.required<UiSonnerToastModel>();
  readonly index = input.required<number>();
  readonly expanded = input.required<boolean>();
  readonly invert = input.required<boolean>();
  readonly position = input.required<UiSonnerPosition>();
  readonly visibleToasts = input.required<number>();
  readonly expandByDefault = input.required<boolean>();
  readonly closeButton = input.required<boolean>();
  readonly closeLabel = input.required<string>();
  readonly interacting = input.required<boolean>();
  readonly duration = input<number | null>(DEFAULT_DURATION);
  readonly descriptionClass = input('');
  readonly gap = input.required<number>();
  readonly frontToastHeight = input.required<string>();
  readonly width = input.required<string>();

  protected readonly mounted = signal(false);
  protected readonly removed = signal(false);
  protected readonly swiping = signal(false);
  protected readonly swipeOut = signal(false);
  protected readonly offsetBeforeRemove = signal(0);
  protected readonly measuredHeight = signal(0);
  protected readonly toastRef = viewChild.required<ElementRef<HTMLLIElement>>('toastRef');

  protected readonly isFront = computed(() => this.index() === 0);
  protected readonly isVisible = computed(
    () => this.expanded() || this.index() + 1 <= this.visibleToasts(),
  );
  protected readonly toastType = computed<UiSonnerToastType>(() => this.toast().type ?? 'default');
  protected readonly toastPosition = computed(() => this.toast().position ?? this.position());
  protected readonly coords = computed(() => this.toastPosition().split('-'));
  protected readonly heightIndex = computed(() =>
    this.heights().findIndex((height) => height.toastId === this.toast().id),
  );
  protected readonly toastsHeightBefore = computed(() =>
    this.heights().reduce((total, currentHeight, reducerIndex) => {
      if (reducerIndex >= this.heightIndex()) {
        return total;
      }

      return total + currentHeight.height;
    }, 0),
  );
  protected readonly offset = linkedSignal({
    source: () => ({
      gap: this.gap(),
      heightIndex: this.heightIndex(),
      toastsHeightBefore: this.toastsHeightBefore(),
    }),
    computation: ({ gap, heightIndex, toastsHeightBefore }) =>
      Math.round(heightIndex * gap + toastsHeightBefore),
  });
  protected readonly resolvedInvert = computed(() => this.toast().invert ?? this.invert());
  protected readonly resolvedCloseButton = computed(
    () => (this.toast().closeButton ?? this.closeButton()) && this.toast().dismissible,
  );
  protected readonly disabled = computed(() => this.toastType() === 'loading');
  protected readonly isPromiseLoadingOrInfiniteDuration = computed(
    () =>
      (this.toast().promise && this.toastType() === 'loading') ||
      this.toast().duration === Number.POSITIVE_INFINITY,
  );
  protected readonly offsetAttribute = computed(
    () => `${this.removed() ? this.offsetBeforeRemove() : this.offset()}px`,
  );
  protected readonly zIndexAttribute = computed(() => this.toasts().length - this.index());
  protected readonly measuredHeightAttribute = computed(() => `${this.measuredHeight()}px`);
  protected readonly gapAttribute = computed(() => `${this.gap()}px`);
  protected readonly iconName = computed(() => {
    const toast = this.toast();

    if (toast.icon) {
      return toast.icon;
    }

    switch (this.toastType()) {
      case 'success':
        return 'outline-circle-check';
      case 'info':
        return 'outline-info-circle';
      case 'warning':
        return 'outline-alert-triangle';
      case 'destructive':
        return 'outline-alert-circle';
      default:
        return null;
    }
  });
  private closeTimerStartTime = 0;
  private lastCloseTimerStartTime = 0;
  private pointerStart: { x: number; y: number } | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  private remainingTime = 0;
  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    effect(() => {
      if (this.toast().updated) {
        clearTimeout(this.timeoutId);
        this.remainingTime = this.toast().duration ?? this.duration() ?? DEFAULT_DURATION;
        this.startTimer();
      }
    });

    afterRenderEffect((onCleanup) => {
      if (!this.isPromiseLoadingOrInfiniteDuration()) {
        if (this.expanded() || this.interacting()) {
          this.pauseTimer();
        } else {
          this.startTimer();
        }
      }

      onCleanup(() => clearTimeout(this.timeoutId));
    });

    effect(() => {
      if (this.toast().delete) {
        this.deleteToast();
      }
    });
  }

  ngAfterViewInit(): void {
    this.remainingTime = this.toast().duration ?? this.duration() ?? DEFAULT_DURATION;
    this.mounted.set(true);
    this.updateHeight(this.toastRef().nativeElement.getBoundingClientRect().height);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        const blockSize = entries[0]?.borderBoxSize?.[0]?.blockSize;

        this.updateHeight(
          blockSize ?? this.toastRef().nativeElement.getBoundingClientRect().height,
        );
      });
      this.resizeObserver.observe(this.toastRef().nativeElement);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.resizeObserver?.disconnect();
    uiSonnerState.removeHeight(this.toast().id);
  }

  protected isString(value: UiSonnerRenderable | undefined): value is string {
    return typeof value === 'string';
  }

  protected asComponent(value: UiSonnerRenderable | undefined): Type<unknown> | null {
    return typeof value === 'function' ? value : null;
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled() || !this.toast().dismissible) {
      return;
    }

    this.offsetBeforeRemove.set(this.offset());

    if (event.target instanceof HTMLElement) {
      event.target.setPointerCapture(event.pointerId);

      if (event.target.tagName === 'BUTTON') {
        return;
      }
    }

    this.swiping.set(true);
    this.pointerStart = { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(): void {
    if (this.swipeOut() || !this.toast().dismissible) {
      return;
    }

    this.pointerStart = null;
    const swipeAmount = Number(
      this.toastRef().nativeElement.style.getPropertyValue('--swipe-amount').replace('px', '') || 0,
    );

    if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD) {
      this.offsetBeforeRemove.set(this.offset());
      this.toast().onDismiss?.(this.toast());
      this.deleteToast();
      this.swipeOut.set(true);
      return;
    }

    this.toastRef().nativeElement.style.setProperty('--swipe-amount', '0px');
    this.swiping.set(false);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.pointerStart || !this.toast().dismissible) {
      return;
    }

    const yPosition = event.clientY - this.pointerStart.y;
    const xPosition = event.clientX - this.pointerStart.x;
    const clamp = this.coords()[0] === 'top' ? Math.min : Math.max;
    const clampedY = clamp(0, yPosition);
    const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;

    if (Math.abs(clampedY) > swipeStartThreshold) {
      this.toastRef().nativeElement.style.setProperty('--swipe-amount', `${yPosition}px`);
    } else if (Math.abs(xPosition) > swipeStartThreshold) {
      this.pointerStart = null;
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (
      (event.key !== 'Escape' && event.key !== 'Delete') ||
      this.disabled() ||
      !this.toast().dismissible
    ) {
      return;
    }

    event.preventDefault();
    // Dismissing a focused toast takes priority over the toaster-level Escape collapse.
    event.stopPropagation();
    this.toast().onDismiss?.(this.toast());
    this.deleteToast();
  }

  protected onCloseButtonClick(): void {
    if (this.disabled() || !this.toast().dismissible) {
      return;
    }

    this.deleteToast();
    this.toast().onDismiss?.(this.toast());
  }

  protected onCancelClick(): void {
    if (!this.toast().dismissible) {
      return;
    }

    this.deleteToast();
    this.toast().cancel?.onClick?.();
  }

  protected onActionClick(event: MouseEvent): void {
    this.toast().action?.onClick(event);

    if (!event.defaultPrevented) {
      this.deleteToast();
    }
  }

  private deleteToast(): void {
    this.removed.set(true);
    this.offsetBeforeRemove.set(this.offset());
    uiSonnerState.removeHeight(this.toast().id);

    setTimeout(() => {
      uiSonnerState.dismiss(this.toast().id);
    }, TIME_BEFORE_UNMOUNT);
  }

  private pauseTimer(): void {
    if (this.lastCloseTimerStartTime < this.closeTimerStartTime) {
      this.remainingTime -= Date.now() - this.closeTimerStartTime;
    }

    this.lastCloseTimerStartTime = Date.now();
  }

  private startTimer(): void {
    clearTimeout(this.timeoutId);
    this.closeTimerStartTime = Date.now();
    this.timeoutId = setTimeout(() => {
      this.toast().onAutoClose?.(this.toast());
      this.deleteToast();
    }, this.remainingTime);
  }

  private updateHeight(height: number): void {
    if (this.removed()) {
      return;
    }

    // CSS owns the toast's own auto height; measured heights only feed stack offsets.
    this.measuredHeight.set(height);
    uiSonnerState.addHeight({ toastId: this.toast().id, height });
  }
}
