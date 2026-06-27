import type { BarcodeEncoding, BarcodeGraphic, UiBarcodeFormat } from './barcode.types';

const EAN_L_PATTERNS = [
  '0001101',
  '0011001',
  '0010011',
  '0111101',
  '0100011',
  '0110001',
  '0101111',
  '0111011',
  '0110111',
  '0001011',
] as const;

const EAN_G_PATTERNS = [
  '0100111',
  '0110011',
  '0011011',
  '0100001',
  '0011101',
  '0111001',
  '0000101',
  '0010001',
  '0001001',
  '0010111',
] as const;

const EAN_R_PATTERNS = [
  '1110010',
  '1100110',
  '1101100',
  '1000010',
  '1011100',
  '1001110',
  '1010000',
  '1000100',
  '1001000',
  '1110100',
] as const;

const EAN13_PARITY = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL',
] as const;

const CODE128_PATTERNS = [
  '212222',
  '222122',
  '222221',
  '121223',
  '121322',
  '131222',
  '122213',
  '122312',
  '132212',
  '221213',
  '221312',
  '231212',
  '112232',
  '122132',
  '122231',
  '113222',
  '123122',
  '123221',
  '223211',
  '221132',
  '221231',
  '213212',
  '223112',
  '312131',
  '311222',
  '321122',
  '321221',
  '312212',
  '322112',
  '322211',
  '212123',
  '212321',
  '232121',
  '111323',
  '131123',
  '131321',
  '112313',
  '132113',
  '132311',
  '211313',
  '231113',
  '231311',
  '112133',
  '112331',
  '132131',
  '113123',
  '113321',
  '133121',
  '313121',
  '211331',
  '231131',
  '213113',
  '213311',
  '213131',
  '311123',
  '311321',
  '331121',
  '312113',
  '312311',
  '332111',
  '314111',
  '221411',
  '431111',
  '111224',
  '111422',
  '121124',
  '121421',
  '141122',
  '141221',
  '112214',
  '112412',
  '122114',
  '122411',
  '142112',
  '142211',
  '241211',
  '221114',
  '413111',
  '241112',
  '134111',
  '111242',
  '121142',
  '121241',
  '114212',
  '124112',
  '124211',
  '411212',
  '421112',
  '421211',
  '212141',
  '214121',
  '412121',
  '111143',
  '111341',
  '131141',
  '114113',
  '114311',
  '411113',
  '411311',
  '113141',
  '114131',
  '311141',
  '411131',
  '211412',
  '211214',
  '211232',
  '2331112',
] as const;

const LINEAR_BAR_HEIGHT = 64;
const LINEAR_TEXT_BASELINE = 78;
const LINEAR_VIEWBOX_HEIGHT = 82;
const QUIET_ZONE = 10;

export function encodeLinearBarcode(
  value: string,
  format: Exclude<UiBarcodeFormat, 'QR'>,
): BarcodeEncoding {
  switch (format) {
    case 'EAN13':
      return encodeEan13(value);
    case 'EAN8':
      return encodeEan8(value);
    case 'CODE128':
      return encodeCode128(value);
  }
}

function encodeEan13(value: string): BarcodeEncoding {
  if (!isDigits(value, 13)) {
    return invalid('EAN-13 requires exactly 13 digits.');
  }

  if (!hasValidEanChecksum(value)) {
    return invalid('EAN-13 check digit is invalid.');
  }

  const digits = [...value].map(Number);
  const parity = EAN13_PARITY[digits[0]];
  const left = digits
    .slice(1, 7)
    .map((digit, index) =>
      parity[index] === 'L' ? EAN_L_PATTERNS[digit] : EAN_G_PATTERNS[digit],
    )
    .join('');
  const right = digits
    .slice(7)
    .map((digit) => EAN_R_PATTERNS[digit])
    .join('');

  return ready(createEanGraphic(`101${left}01010${right}101`, value));
}

function encodeEan8(value: string): BarcodeEncoding {
  if (!isDigits(value, 8)) {
    return invalid('EAN-8 requires exactly 8 digits.');
  }

  if (!hasValidEanChecksum(value)) {
    return invalid('EAN-8 check digit is invalid.');
  }

  const digits = [...value].map(Number);
  const left = digits
    .slice(0, 4)
    .map((digit) => EAN_L_PATTERNS[digit])
    .join('');
  const right = digits
    .slice(4)
    .map((digit) => EAN_R_PATTERNS[digit])
    .join('');

  return ready(createEanGraphic(`101${left}01010${right}101`, value));
}

function encodeCode128(value: string): BarcodeEncoding {
  const codes = [...value].map((character) => character.codePointAt(0)! - 32);

  if (codes.some((code) => code < 0 || code > 95)) {
    return invalid('Code 128 supports printable ASCII characters only.');
  }

  const values = [104, ...codes];
  const checksum =
    values.reduce((sum, code, index) => sum + code * (index === 0 ? 1 : index), 0) % 103;
  const patterns = [...values, checksum, 106].map((code) => CODE128_PATTERNS[code]);
  let cursor = QUIET_ZONE;
  let path = '';

  for (const pattern of patterns) {
    for (let index = 0; index < pattern.length; index += 1) {
      const width = Number(pattern[index]);

      if (index % 2 === 0) {
        path += rectPath(cursor, 0, width, LINEAR_BAR_HEIGHT);
      }

      cursor += width;
    }
  }

  const totalWidth = cursor + QUIET_ZONE;

  return ready({
    kind: 'linear',
    viewBox: `0 0 ${totalWidth} ${LINEAR_VIEWBOX_HEIGHT}`,
    path,
    text: value,
    textX: totalWidth / 2,
    textY: LINEAR_TEXT_BASELINE,
  });
}

function createEanGraphic(bits: string, text: string): BarcodeGraphic {
  let path = '';

  for (const [index, bit] of [...bits].entries()) {
    if (bit === '1') {
      path += rectPath(index + QUIET_ZONE, 0, 1, LINEAR_BAR_HEIGHT);
    }
  }

  const totalWidth = bits.length + QUIET_ZONE * 2;

  return {
    kind: 'linear',
    viewBox: `0 0 ${totalWidth} ${LINEAR_VIEWBOX_HEIGHT}`,
    path,
    text,
    textX: totalWidth / 2,
    textY: LINEAR_TEXT_BASELINE,
  };
}

function hasValidEanChecksum(value: string): boolean {
  const digits = [...value].map(Number);
  const checkDigit = digits.pop();
  const sum = digits
    .reverse()
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);

  return checkDigit === (10 - (sum % 10)) % 10;
}

function isDigits(value: string, length: number): boolean {
  return new RegExp(`^\\d{${length}}$`).test(value);
}

function rectPath(x: number, y: number, width: number, height: number): string {
  return `M${x} ${y}h${width}v${height}h-${width}z`;
}

function ready(graphic: BarcodeGraphic): BarcodeEncoding {
  return { state: 'ready', graphic };
}

function invalid(message: string): BarcodeEncoding {
  return { state: 'invalid', message };
}
