import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  DestroyRef,
  EnvironmentInjector,
  inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { UI_SONNER_STATE } from './ui-sonner.state';
import {
  UiSonnerExternalToast,
  UiSonnerPromise,
  UiSonnerPromiseData,
  UiSonnerToastId,
} from './ui-sonner.type';
import { UiSonner } from './ui-sonner';

@Injectable({ providedIn: 'root' })
export class SonnerService {
  private readonly state = inject(UI_SONNER_STATE);
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private outletRef: ComponentRef<UiSonner> | null = null;

  readonly toasts = this.state.toasts;
  readonly heights = this.state.heights;

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyOutlet());
  }

  show(title: string, options?: UiSonnerExternalToast): UiSonnerToastId;
  show(options: UiSonnerExternalToast & { title: string }): UiSonnerToastId;
  show(
    titleOrOptions: string | (UiSonnerExternalToast & { title: string }),
    options?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    this.ensureOutlet();
    return typeof titleOrOptions === 'string'
      ? this.state.create({ ...options, message: titleOrOptions })
      : this.state.create({ ...titleOrOptions, message: titleOrOptions.title });
  }

  success(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    this.ensureOutlet();
    return this.state.success(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  info(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    this.ensureOutlet();
    return this.state.info(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  warning(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    this.ensureOutlet();
    return this.state.warning(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  destructive(
    title: string,
    description?: string,
    options?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    this.ensureOutlet();
    return this.state.destructive(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  error(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.destructive(title, description, options);
  }

  loading(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    this.ensureOutlet();
    return this.state.loading(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  promise<ToastData>(
    promiseInput: UiSonnerPromise<ToastData>,
    data?: UiSonnerPromiseData<ToastData>,
  ): UiSonnerToastId | undefined {
    if (data) {
      this.ensureOutlet();
    }
    return this.state.promise(promiseInput, data);
  }

  dismiss(id?: UiSonnerToastId): UiSonnerToastId | undefined {
    return this.state.dismiss(id);
  }

  reset(): void {
    this.state.reset();
  }

  private ensureOutlet(): void {
    if (!this.isBrowser || this.outletRef || this.document.querySelector('ui-sonner')) {
      return;
    }

    // The default API is service-only: lazily mount one Angular-managed outlet
    // on first use. A manually declared <ui-sonner> still wins for custom inputs.
    const outletRef = createComponent(UiSonner, {
      environmentInjector: this.environmentInjector,
    });

    this.applicationRef.attachView(outletRef.hostView);
    this.document.body.appendChild(outletRef.location.nativeElement);
    outletRef.changeDetectorRef.detectChanges();
    this.outletRef = outletRef;
  }

  private destroyOutlet(): void {
    if (!this.outletRef) {
      return;
    }

    this.applicationRef.detachView(this.outletRef.hostView);
    this.outletRef.destroy();
    this.outletRef = null;
  }
}
