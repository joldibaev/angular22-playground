import type { BarcodeEncoding } from './barcode.types';

const QR_SIZE = 21;
const QR_DATA_CODEWORDS = 19;
const QR_ECC_CODEWORDS = 7;
const QR_GENERATOR = [87, 229, 146, 149, 238, 102, 21] as const;
const QR_FORMAT_L_MASK_0 = 0b111011111000100;
const QR_QUIET_ZONE = 4;

// Version 1-L keeps the local encoder small and auditable. Longer payloads should use a dedicated,
// standards-tested encoder rather than growing an incomplete version-selection implementation here.

interface QrMatrix {
  readonly modules: boolean[][];
  readonly reserved: boolean[][];
}

export function encodeQrCode(value: string): BarcodeEncoding {
  const bytes = new TextEncoder().encode(value);

  if (bytes.length > 17) {
    return {
      state: 'invalid',
      message: 'QR version 1-L accepts at most 17 UTF-8 bytes.',
    };
  }

  const matrix = createEmptyMatrix();
  addFinder(matrix, 0, 0);
  addFinder(matrix, QR_SIZE - 7, 0);
  addFinder(matrix, 0, QR_SIZE - 7);
  addTiming(matrix);
  reserveFormatAreas(matrix);
  setModule(matrix, 8, QR_SIZE - 8, true);
  addData(matrix, createCodewords(bytes));
  addFormatBits(matrix);

  let path = '';

  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      if (matrix.modules[y][x]) {
        path += rectPath(x + QR_QUIET_ZONE, y + QR_QUIET_ZONE);
      }
    }
  }

  const size = QR_SIZE + QR_QUIET_ZONE * 2;

  return {
    state: 'ready',
    graphic: {
      kind: 'matrix',
      viewBox: `0 0 ${size} ${size}`,
      path,
    },
  };
}

function createEmptyMatrix(): QrMatrix {
  return {
    modules: Array.from({ length: QR_SIZE }, () => Array<boolean>(QR_SIZE).fill(false)),
    reserved: Array.from({ length: QR_SIZE }, () => Array<boolean>(QR_SIZE).fill(false)),
  };
}

function setModule(matrix: QrMatrix, x: number, y: number, value: boolean, reserved = true): void {
  if (x < 0 || y < 0 || x >= QR_SIZE || y >= QR_SIZE) {
    return;
  }

  matrix.modules[y][x] = value;
  matrix.reserved[y][x] = reserved;
}

function addFinder(matrix: QrMatrix, startX: number, startY: number): void {
  for (let y = -1; y <= 7; y += 1) {
    for (let x = -1; x <= 7; x += 1) {
      const isFinder =
        x >= 0 &&
        y >= 0 &&
        x <= 6 &&
        y <= 6 &&
        (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));

      setModule(matrix, startX + x, startY + y, isFinder);
    }
  }
}

function addTiming(matrix: QrMatrix): void {
  for (let index = 8; index < QR_SIZE - 8; index += 1) {
    const value = index % 2 === 0;
    setModule(matrix, index, 6, value);
    setModule(matrix, 6, index, value);
  }
}

function reserveFormatAreas(matrix: QrMatrix): void {
  for (let index = 0; index < 9; index += 1) {
    if (index !== 6) {
      matrix.reserved[8][index] = true;
      matrix.reserved[index][8] = true;
    }
  }

  for (let index = QR_SIZE - 8; index < QR_SIZE; index += 1) {
    matrix.reserved[8][index] = true;
    matrix.reserved[index][8] = true;
  }
}

function addData(matrix: QrMatrix, codewords: number[]): void {
  const bits = codewords.flatMap((codeword) => numberToBits(codeword, 8).map(Boolean));
  let bitIndex = 0;
  let upward = true;

  for (let x = QR_SIZE - 1; x > 0; x -= 2) {
    if (x === 6) {
      x -= 1;
    }

    for (let rowOffset = 0; rowOffset < QR_SIZE; rowOffset += 1) {
      const y = upward ? QR_SIZE - 1 - rowOffset : rowOffset;

      for (let offset = 0; offset < 2; offset += 1) {
        const currentX = x - offset;

        if (!matrix.reserved[y][currentX]) {
          const bit = bits[bitIndex] ?? false;
          matrix.modules[y][currentX] = bit !== ((currentX + y) % 2 === 0);
          matrix.reserved[y][currentX] = true;
          bitIndex += 1;
        }
      }
    }

    upward = !upward;
  }
}

function addFormatBits(matrix: QrMatrix): void {
  const bits = QR_FORMAT_L_MASK_0.toString(2).padStart(15, '0');
  const primary = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ] as const;

  primary.forEach(([x, y], index) => {
    matrix.modules[y][x] = bits[index] === '1';
  });

  for (let index = 0; index < 8; index += 1) {
    matrix.modules[QR_SIZE - 1 - index][8] = bits[index] === '1';
  }

  for (let index = 8; index < 15; index += 1) {
    matrix.modules[8][QR_SIZE - 15 + index] = bits[index] === '1';
  }
}

function createCodewords(bytes: Uint8Array): number[] {
  const bits = [
    ...numberToBits(0b0100, 4),
    ...numberToBits(bytes.length, 8),
    ...Array.from(bytes).flatMap((byte) => numberToBits(byte, 8)),
  ];
  const terminatorLength = Math.min(4, QR_DATA_CODEWORDS * 8 - bits.length);
  bits.push(...Array<number>(terminatorLength).fill(0));

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const data: number[] = [];

  for (let index = 0; index < bits.length; index += 8) {
    data.push(Number.parseInt(bits.slice(index, index + 8).join(''), 2));
  }

  let padIndex = 0;

  while (data.length < QR_DATA_CODEWORDS) {
    data.push(padIndex % 2 === 0 ? 0xec : 0x11);
    padIndex += 1;
  }

  return [...data, ...createErrorCorrection(data)];
}

function createErrorCorrection(data: number[]): number[] {
  const result = [...data, ...Array<number>(QR_ECC_CODEWORDS).fill(0)];

  for (let index = 0; index < data.length; index += 1) {
    const coefficient = result[index];

    if (coefficient === 0) {
      continue;
    }

    for (let offset = 0; offset < QR_GENERATOR.length; offset += 1) {
      result[index + offset + 1] ^= gfMultiply(QR_GENERATOR[offset], coefficient);
    }
  }

  return result.slice(-QR_ECC_CODEWORDS);
}

function numberToBits(value: number, length: number): number[] {
  return [...value.toString(2).padStart(length, '0')].map(Number);
}

function gfMultiply(left: number, right: number): number {
  let result = 0;
  let a = left;
  let b = right;

  while (b > 0) {
    if (b & 1) {
      result ^= a;
    }

    a <<= 1;

    if (a & 0x100) {
      a ^= 0x11d;
    }

    b >>= 1;
  }

  return result;
}

function rectPath(x: number, y: number): string {
  return `M${x} ${y}h1v1h-1z`;
}
