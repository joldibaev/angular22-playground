import { Injectable } from '@angular/core';
import { toast, uiSonnerState } from './ui-sonner.state';
import {
  UiSonnerExternalToast,
  UiSonnerPromise,
  UiSonnerPromiseData,
  UiSonnerToastId,
} from './ui-sonner.type';

@Injectable({ providedIn: 'root' })
export class SonnerService {
  readonly toasts = uiSonnerState.toasts;
  readonly heights = uiSonnerState.heights;

  show(title: string, options?: UiSonnerExternalToast): UiSonnerToastId;
  show(options: UiSonnerExternalToast & { title: string }): UiSonnerToastId;
  show(
    titleOrOptions: string | (UiSonnerExternalToast & { title: string }),
    options?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    return typeof titleOrOptions === 'string'
      ? toast(titleOrOptions, options)
      : toast(titleOrOptions.title, titleOrOptions);
  }

  success(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return toast.success(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  info(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return toast.info(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  warning(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return toast.warning(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  destructive(
    title: string,
    description?: string,
    options?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    return toast.destructive(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  error(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return this.destructive(title, description, options);
  }

  loading(title: string, description?: string, options?: UiSonnerExternalToast): UiSonnerToastId {
    return toast.loading(title, {
      ...options,
      description: description ?? options?.description,
    });
  }

  promise<ToastData>(
    promiseInput: UiSonnerPromise<ToastData>,
    data?: UiSonnerPromiseData<ToastData>,
  ): UiSonnerToastId | undefined {
    return toast.promise(promiseInput, data);
  }

  dismiss(id?: UiSonnerToastId): UiSonnerToastId | undefined {
    return toast.dismiss(id);
  }

  reset(): void {
    uiSonnerState.reset();
  }
}
