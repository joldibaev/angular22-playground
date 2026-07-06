import { encodeQrCode } from './qr-code.encoder';

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
});
