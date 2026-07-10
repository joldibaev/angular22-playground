import jsQR from 'jsqr';

import { encodeQrCode } from './qr-code.encoder';

function rasterize(path: string, moduleCount = 29, scale = 8): {
  data: Uint8ClampedArray;
  size: number;
} {
  const size = moduleCount * scale;
  const data = new Uint8ClampedArray(size * size * 4);

  data.fill(255);

  for (const match of path.matchAll(/M(\d+) (\d+)h1v1h-1z/g)) {
    const moduleX = Number(match[1]);
    const moduleY = Number(match[2]);

    for (let y = moduleY * scale; y < (moduleY + 1) * scale; y += 1) {
      for (let x = moduleX * scale; x < (moduleX + 1) * scale; x += 1) {
        const offset = (y * size + x) * 4;
        data[offset] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
      }
    }
  }

  return { data, size };
}

describe('encodeQrCode', () => {
  it('encodes a deterministic version 1-L matrix with a four-module quiet zone', () => {
    const first = encodeQrCode('HELLO WORLD');
    const second = encodeQrCode('HELLO WORLD');

    expect(first).toEqual(second);
    expect(first.state).toBe('ready');
    if (first.state !== 'ready') return;

    expect(first.graphic.kind).toBe('matrix');
    expect(first.graphic.viewBox).toBe('0 0 29 29');
    expect(first.graphic.path).toContain('M4 4h1v1h-1z');
    expect(first.graphic.path).toContain('M20 4h1v1h-1z');
    expect(first.graphic.path).toContain('M4 20h1v1h-1z');
  });

  it('enforces the payload limit in UTF-8 bytes rather than characters', () => {
    expect(encodeQrCode('12345678901234567').state).toBe('ready');
    expect(encodeQrCode('я'.repeat(9))).toEqual({
      state: 'invalid',
      message: 'QR version 1-L accepts at most 17 UTF-8 bytes.',
    });
  });

  it('produces a matrix that an independent QR decoder can read', () => {
    const encoding = encodeQrCode('HELLO WORLD');

    expect(encoding.state).toBe('ready');
    if (encoding.state !== 'ready') return;

    const image = rasterize(encoding.graphic.path);
    const decoded = jsQR(image.data, image.size, image.size, {
      inversionAttempts: 'dontInvert',
    });

    expect(decoded?.data).toBe('HELLO WORLD');
    expect(decoded?.version).toBe(1);
  });
});
