import { encodeLinearBarcode } from './linear-barcode.encoder';

describe('encodeLinearBarcode', () => {
  it('encodes the canonical EAN-13 example into the expected module geometry', () => {
    const result = encodeLinearBarcode('4006381333931', 'EAN13');

    expect(result.state).toBe('ready');
    if (result.state !== 'ready') return;

    expect(result.graphic).toEqual(
      expect.objectContaining({
        kind: 'linear',
        viewBox: '0 0 115 82',
        text: '4006381333931',
        textX: 57.5,
        textY: 78,
      }),
    );
    expect(result.graphic.path.startsWith('M10 0h1v64h-1z')).toBe(true);
  });

  it('validates EAN length, characters, and checksum', () => {
    expect(encodeLinearBarcode('123', 'EAN8')).toEqual({
      state: 'invalid',
      message: 'EAN-8 requires exactly 8 digits.',
    });
    expect(encodeLinearBarcode('55123458', 'EAN8')).toEqual({
      state: 'invalid',
      message: 'EAN-8 check digit is invalid.',
    });
  });

  it('preserves printable whitespace in Code 128-B and rejects non-ASCII input', () => {
    const result = encodeLinearBarcode(' A ', 'CODE128');

    expect(result.state).toBe('ready');
    if (result.state === 'ready') expect(result.graphic.text).toBe(' A ');
    expect(encodeLinearBarcode('А', 'CODE128')).toEqual({
      state: 'invalid',
      message: 'Code 128 supports printable ASCII characters only.',
    });
  });
});
