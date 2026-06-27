import type { BarcodeEncoding, UiBarcodeFormat } from './barcode.types';
import { encodeLinearBarcode } from './linear-barcode.encoder';
import { encodeQrCode } from './qr-code.encoder';

export function encodeBarcode(value: string, format: UiBarcodeFormat): BarcodeEncoding {
  if (value.length === 0) {
    return { state: 'invalid', message: 'A barcode value is required.' };
  }

  return format === 'QR' ? encodeQrCode(value) : encodeLinearBarcode(value, format);
}
