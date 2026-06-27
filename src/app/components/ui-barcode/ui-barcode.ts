import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { encodeBarcode } from './barcode.encoder';
import type { UiBarcodeFormat } from './barcode.types';

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 96;

@Component({
  selector: 'ui-barcode',
  templateUrl: './ui-barcode.html',
  styleUrl: './ui-barcode.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-format]': 'format()',
    '[attr.data-state]': 'encoding().state',
    '[style.aspect-ratio]': 'width() + " / " + height()',
    '[style.--ui-barcode-width]': 'width() + "px"',
    '[style.--ui-barcode-height]': 'height() + "px"',
  },
})
export class UiBarcode {
  readonly value = input.required<string>();
  readonly format = input<UiBarcodeFormat>('CODE128');
  readonly width = input(DEFAULT_WIDTH, { transform: positiveDimension(DEFAULT_WIDTH) });
  readonly height = input(DEFAULT_HEIGHT, { transform: positiveDimension(DEFAULT_HEIGHT) });
  readonly withText = input(true, { transform: booleanAttribute });
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly label = input<string>();

  protected readonly encoding = computed(() => encodeBarcode(this.value(), this.format()));
  protected readonly accessibleLabel = computed(
    () => this.label() || `${formatName(this.format())}: ${this.value()}`,
  );

  protected invalidLabel(message: string): string {
    return `${this.accessibleLabel()}. Cannot render barcode: ${message}`;
  }
}

export type { UiBarcodeFormat } from './barcode.types';

function positiveDimension(fallback: number): (value: unknown) => number {
  return (value) => {
    const number = numberAttribute(value, fallback);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  };
}

function formatName(format: UiBarcodeFormat): string {
  switch (format) {
    case 'EAN13':
      return 'EAN-13';
    case 'EAN8':
      return 'EAN-8';
    case 'CODE128':
      return 'Code 128';
    case 'QR':
      return 'QR code';
  }
}
