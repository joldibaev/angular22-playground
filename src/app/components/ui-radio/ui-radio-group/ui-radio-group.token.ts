import { InjectionToken } from '@angular/core';

export type UiRadioSize = 'sm' | 'md';

export interface UiRadioGroupControl {
  name(): string;
  value(): string;
  disabled(): boolean;
  required(): boolean;
  // The group owns the size so a single `<ui-radio-group size>` cascades to every
  // child; an individual `<ui-radio>` may still override it.
  size(): UiRadioSize;
  describedBy(): string | null;
  select(value: string): void;
  markTouched(): void;
}

export const UI_RADIO_GROUP = new InjectionToken<UiRadioGroupControl>('UI_RADIO_GROUP');
