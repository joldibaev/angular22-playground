import { Injectable } from '@angular/core';
import { createToastState } from './ui-sonner.state';
import {
  UiSonnerExternalToast,
  UiSonnerHeight,
  UiSonnerPromise,
  UiSonnerPromiseData,
  UiSonnerToastId,
} from './ui-sonner.type';

@Injectable({ providedIn: 'root' })
export class SonnerService {
  // Root providers are created per Angular application, including once per SSR request.
  // Never move this state back to module scope: concurrent requests would share notifications.
  private readonly state = createToastState();
  readonly toasts = this.state.toasts;
  readonly heights = this.state.heights;

  show(title: string, options?: UiSonnerExternalToast): UiSonnerToastId;
  show(options: UiSonnerExternalToast & { title: string }): UiSonnerToastId;
  show(
    titleOrOptions: string | (UiSonnerExternalToast & { title: string }),
    options?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    return typeof titleOrOptions === 'string'
      ? this.state.create({ ...options, message: titleOrOptions })
      : this.state.create({ ...titleOrOptions, message: titleOrOptions.title });
  }

  success(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.state.success(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  info(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.state.info(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  warning(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
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
    return this.state.destructive(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  error(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.destructive(title, description, options);
  }

  loading(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.state.loading(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  promise<ToastData>(
    promiseInput: UiSonnerPromise<ToastData>,
    data?: UiSonnerPromiseData<ToastData>,
  ): UiSonnerToastId | undefined {
    return this.state.promise(promiseInput, data);
  }

  dismiss(id?: UiSonnerToastId): UiSonnerToastId | undefined {
    return this.state.dismiss(id);
  }

  reset(): void {
    this.state.reset();
  }

  addHeight(height: UiSonnerHeight): void {
    this.state.addHeight(height);
  }

  removeHeight(id: UiSonnerToastId): void {
    this.state.removeHeight(id);
  }

  remove(id: UiSonnerToastId): void {
    this.state.remove(id);
  }
}
