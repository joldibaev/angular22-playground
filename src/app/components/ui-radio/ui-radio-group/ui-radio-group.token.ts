import { InjectionToken } from '@angular/core';

export interface UiRadioGroupControl {
  name(): string;
  value(): string;
  disabled(): boolean;
  required(): boolean;
  describedBy(): string | null;
  select(value: string): void;
  markTouched(): void;
}

export const UI_RADIO_GROUP = new InjectionToken<UiRadioGroupControl>('UI_RADIO_GROUP');
