// Keep domain categories such as “internal” outside this API; every value here is a real symbology.
export type UiBarcodeFormat = 'EAN13' | 'EAN8' | 'CODE128' | 'QR';

export interface BarcodeGraphic {
  readonly kind: 'linear' | 'matrix';
  readonly viewBox: string;
  readonly path: string;
  readonly text?: string;
  readonly textX?: number;
  readonly textY?: number;
}

export type BarcodeEncoding =
  | { readonly state: 'ready'; readonly graphic: BarcodeGraphic }
  | { readonly state: 'invalid'; readonly message: string };
