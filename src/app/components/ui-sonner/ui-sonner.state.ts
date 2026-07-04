import { signal } from '@angular/core';
import {
  UiSonnerExternalToast,
  UiSonnerHeight,
  UiSonnerPromise,
  UiSonnerPromiseData,
  UiSonnerToast,
  UiSonnerToastId,
  UiSonnerToastType,
} from './ui-sonner.type';

let toastCounter = 0;

function createToastState() {
  const toastsState = signal<UiSonnerToast[]>([]);
  const heightsState = signal<UiSonnerHeight[]>([]);

  function create(
    input: UiSonnerExternalToast & {
      message?: string;
      type?: UiSonnerToastType;
      promise?: UiSonnerPromise;
    },
  ): UiSonnerToastId {
    const { message, ...rest } = input;
    const id = resolveId(input.id);
    const dismissible = input.dismissible ?? true;
    const type = input.type ?? 'default';
    const existing = toastsState().some((toastItem) => toastItem.id === id);

    if (existing) {
      toastsState.update((toasts) =>
        toasts.map((toastItem) =>
          toastItem.id === id
            ? {
                ...toastItem,
                ...rest,
                id,
                title: message,
                // A direct loading toast owns an infinite duration. Once that same ID becomes
                // a settled toast, fall back to the toaster duration unless the caller overrides it.
                duration:
                  input.duration ??
                  (toastItem.type === 'loading' && type !== 'loading'
                    ? undefined
                    : toastItem.duration),
                dismissible,
                type,
                delete: false,
                dismissing: false,
                updated: true,
              }
            : { ...toastItem, updated: false },
        ),
      );
    } else {
      toastsState.update((toasts) => [
        {
          ...rest,
          id,
          title: message,
          dismissible,
          type,
          dismissing: false,
        },
        ...toasts,
      ]);
    }

    return id;
  }

  function dismiss(id?: UiSonnerToastId): UiSonnerToastId | undefined {
    if (id === undefined) {
      toastsState.update((toasts) =>
        toasts.map((toastItem) => ({ ...toastItem, delete: true, dismissing: true })),
      );
      return undefined;
    }

    toastsState.update((toasts) =>
      toasts.map((toastItem) =>
        toastItem.id === id ? { ...toastItem, delete: true, dismissing: true } : toastItem,
      ),
    );
    return id;
  }

  function remove(id: UiSonnerToastId): void {
    toastsState.update((toasts) => toasts.filter((toastItem) => toastItem.id !== id));
    heightsState.update((heights) => heights.filter((height) => height.toastId !== id));
  }

  function message(messageText: string, data?: UiSonnerExternalToast): UiSonnerToastId {
    return create({ ...data, type: 'default', message: messageText });
  }

  function success(messageText: string, data?: UiSonnerExternalToast): UiSonnerToastId {
    return create({ ...data, type: 'success', message: messageText });
  }

  function info(messageText: string, data?: UiSonnerExternalToast): UiSonnerToastId {
    return create({ ...data, type: 'info', message: messageText });
  }

  function warning(messageText: string, data?: UiSonnerExternalToast): UiSonnerToastId {
    return create({ ...data, type: 'warning', message: messageText });
  }

  function destructive(
    messageText: string,
    data?: UiSonnerExternalToast,
  ): UiSonnerToastId {
    return create({ ...data, type: 'destructive', message: messageText });
  }

  function loading(messageText: string, data?: UiSonnerExternalToast): UiSonnerToastId {
    return create({
      ...data,
      duration: data?.duration ?? Number.POSITIVE_INFINITY,
      type: 'loading',
      message: messageText,
    });
  }

  function promise<ToastData>(
    promiseInput: UiSonnerPromise<ToastData>,
    data?: UiSonnerPromiseData<ToastData>,
  ): UiSonnerToastId | undefined {
    if (!data) {
      return undefined;
    }

    let id: UiSonnerToastId | undefined;

    if (data.loading !== undefined) {
      id = create({ ...data, promise: promiseInput, type: 'loading', message: data.loading });
    }

    const activePromise = promiseInput instanceof Promise ? promiseInput : promiseInput();
    let shouldDismiss = id !== undefined;

    void activePromise
      .then((response) => {
        if (isResponseLike(response) && !response.ok) {
          shouldDismiss = false;
          create({
            ...data,
            id,
            type: 'destructive',
            message: resolvePromiseValue(data.error, `HTTP error! status: ${response.status}`),
          });
          return;
        }

        if (data.success !== undefined) {
          shouldDismiss = false;
          create({
            ...data,
            id,
            type: 'success',
            message: resolvePromiseValue(data.success, response),
          });
        }
      })
      .catch((errorValue: unknown) => {
        if (data.error !== undefined) {
          shouldDismiss = false;
          create({
            ...data,
            id,
            type: 'destructive',
            message: resolvePromiseValue(data.error, errorValue),
          });
        }
      })
      .finally(() => {
        if (shouldDismiss && id !== undefined) {
          dismiss(id);
          id = undefined;
        }

        void data.finally?.();
      });

    return id;
  }

  function addHeight(height: UiSonnerHeight): void {
    heightsState.update((heights) =>
      [...heights.filter((item) => item.toastId !== height.toastId), height].sort(sortHeights),
    );
  }

  function removeHeight(id: UiSonnerToastId): void {
    heightsState.update((heights) => heights.filter((height) => height.toastId !== id));
  }

  function reset(): void {
    toastsState.set([]);
    heightsState.set([]);
  }

  function sortHeights(left: UiSonnerHeight, right: UiSonnerHeight): number {
    return (
      toastsState().findIndex((toastItem) => toastItem.id === left.toastId) -
      toastsState().findIndex((toastItem) => toastItem.id === right.toastId)
    );
  }

  return {
    addHeight,
    create,
    destructive,
    dismiss,
    heights: heightsState.asReadonly(),
    info,
    loading,
    message,
    promise,
    remove,
    removeHeight,
    reset,
    success,
    toasts: toastsState.asReadonly(),
    warning,
  };
}

export const uiSonnerState = createToastState();

function toastFunction(
  messageText: string,
  data?: UiSonnerExternalToast,
): UiSonnerToastId {
  return uiSonnerState.create({ ...data, message: messageText });
}

export const toast = Object.assign(toastFunction, {
  destructive: uiSonnerState.destructive,
  dismiss: uiSonnerState.dismiss,
  error: uiSonnerState.destructive,
  info: uiSonnerState.info,
  loading: uiSonnerState.loading,
  message: uiSonnerState.message,
  promise: uiSonnerState.promise,
  success: uiSonnerState.success,
  warning: uiSonnerState.warning,
});

function resolveId(id?: UiSonnerToastId): UiSonnerToastId {
  if (typeof id === 'number' || (typeof id === 'string' && id.length > 0)) {
    return id;
  }

  return toastCounter++;
}

function isResponseLike(value: unknown): value is { ok: boolean; status: number } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as { ok?: unknown; status?: unknown };
  return typeof candidate.ok === 'boolean' && typeof candidate.status === 'number';
}

function resolvePromiseValue<ToastData>(
  value:
    | string
    | ((payload: ToastData) => string)
    | undefined,
  payload: ToastData,
): string {
  return typeof value === 'function' ? value(payload) : (value ?? String(payload));
}
