import { IconName } from '../ui-icon/data';

export type UiSonnerToastType =
  | 'default'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'destructive'
  | 'loading';

export type UiSonnerPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type UiSonnerToastId = number | string;
export type UiSonnerPromise<ToastData = unknown> = Promise<ToastData> | (() => Promise<ToastData>);

export type UiSonnerTheme = 'light' | 'dark' | 'system';

export interface UiSonnerToastAction {
  label: string;
  onClick: (event: MouseEvent) => void;
}

export interface UiSonnerToastCancel {
  label: string;
  onClick?: () => void;
}

export interface UiSonnerToast {
  id: UiSonnerToastId;
  title?: string;
  description?: string;
  type: UiSonnerToastType;
  icon?: IconName;
  duration?: number;
  dismissible: boolean;
  closeButton?: boolean;
  invert?: boolean;
  important?: boolean;
  position?: UiSonnerPosition;
  action?: UiSonnerToastAction;
  cancel?: UiSonnerToastCancel;
  promise?: UiSonnerPromise;
  onDismiss?: (toast: UiSonnerToast) => void;
  onAutoClose?: (toast: UiSonnerToast) => void;
  delete?: boolean;
  dismissing?: boolean;
  updated?: boolean;
}

export type UiSonnerExternalToast = Omit<
  UiSonnerToast,
  'id' | 'title' | 'type' | 'dismissible' | 'dismissing'
> & {
  id?: UiSonnerToastId;
  title?: string;
  type?: UiSonnerToastType;
  dismissible?: boolean;
};

export type UiSonnerPromiseData<ToastData = unknown> = UiSonnerExternalToast & {
  loading?: string;
  success?: string | ((data: ToastData) => string);
  error?: string | ((error: unknown) => string);
  finally?: () => void | Promise<void>;
};

export interface UiSonnerHeight {
  height: number;
  toastId: UiSonnerToastId;
}

export interface UiSonnerToastOptions {
  duration?: number;
  class?: string;
  descriptionClass?: string;
}
